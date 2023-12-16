import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { createCourse } from "../services/courseService";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notificationModel";

/**
 *
 * @DESC   upload course
 * @ROUTE /api/v1/create-course
 * @method POST
 * @access private
 *
 */
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "lms/course",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 *
 * @DESC   update course
 * @ROUTE /api/v1/update-course/:id
 * @method PUT
 * @access private
 *
 */
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "lms/course",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );
      res.status(201).json({ status: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 *
 * @DESC   single course -- without purchasing
 * @ROUTE /api/v1/get-course/:id
 * @method GET
 * @access public
 *
 */
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({ success: true, course });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl  -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(courseId, JSON.stringify(course));

        res.status(201).json({ status: true, course });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
/**
 *
 * @DESC   all course -- without purchasing
 * @ROUTE /api/v1/get-courses
 * @method GET
 * @access public
 *
 */
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allcourses");

      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        res.status(201).json({ status: true, courses });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl  -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set("allcourses", JSON.stringify(courses));
        res.status(201).json({ status: true, courses });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 *
 * @DESC   all course -- without purchasing
 * @ROUTE /api/v1/get-course-content/:id
 * @method GET
 * @access private
 *
 */

export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id == courseId
      );

      console.log(courseExists);

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      res.status(200).json({ success: true, content });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 *
 * @DESC   add question in course
 * @ROUTE /api/v1/add-question
 * @method PUT
 * @access private
 *
 */

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, contentId, courseId } = req.body as IAddQuestionData;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      courseContent?.questions.push(newQuestion);
      await NotificationModel.create({
        userId: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${courseContent?.title}`,
      });
      // save the updatted course
      await course?.save();
      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 *
 * @DESC   add answer in question
 * @ROUTE /api/v1/add-answer
 * @method PUT
 * @access private
 *
 */

interface IAddQuestionData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnwser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, contentId, courseId, questionId } =
        req.body as IAddQuestionData;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      // create a new question object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies?.push(newAnswer);
      // save the updatted course
      await course?.save();

      if (req.user?._id == question.user._id) {
        await NotificationModel.create({
          userId: req.user?._id,
          title: "New Question Reply Recived",
          message: `You have a new question  reply in ${courseContent?.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 *
 * @DESC   add review in course
 * @ROUTE /api/v1/add-review/:id
 * @method PUT
 * @access private
 *
 */

interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      // check if course is already  exists in userCourseList based on _id
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() == courseId.toString()
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("you are not eligible to access this course", 404)
        );
      }
      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "New review Recived",
        message: `${req.user?.name} has given a review in ${course?.name}`,
      };

      res.status(201).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 *
 * @DESC   add reply in review
 * @ROUTE /api/v1/add-reply
 * @method PUT
 * @access private
 *
 */

interface IAddReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReplyData;

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() == reviewId
      );
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }
      const replyData: any = {
        user: req.user,
        comment,
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);
      await course?.save();

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
