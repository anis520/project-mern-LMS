import express from "express";

import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  addAnwser,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourses,
  getAllCoursesAdmin,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAutheticated,
  authorizeRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/update-course/:id",
  isAutheticated,
  authorizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourses);
courseRouter.get("/get-course-content/:id", isAutheticated, getCourseByUser);
courseRouter.put("/add-question", isAutheticated, addQuestion);
courseRouter.put("/add-answer", isAutheticated, addAnwser);
courseRouter.put("/add-review/:id", isAutheticated, getAllCourses);
courseRouter.get(
  "/get-courses-admin",
  isAutheticated,
  authorizeRoles("admin"),
  getAllCoursesAdmin
);
courseRouter.put(
  "/add-reply",
  isAutheticated,
  authorizeRoles("admin"),
  addReplyToReview
);

courseRouter.delete(
  "/delete-course/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
