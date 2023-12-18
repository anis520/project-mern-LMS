import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLastMothsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/orderModel";

/**
 *
 * @DESC   get users analytics - admin only
 * @ROUTE /api/v1/get-users-analytics
 * @method GET
 * @access private
 *
 */

export const getUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLastMothsData(userModel);

      res.status(200).json({ success: true, users });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
/**
 *
 * @DESC   get courses analytics - admin only
 * @ROUTE /api/v1/get-courses-analytics
 * @method GET
 * @access private
 *
 */

export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLastMothsData(CourseModel);

      res.status(200).json({ success: true, courses });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
/**
 *
 * @DESC   get orders analytics - admin only
 * @ROUTE /api/v1/get-orders-analytics
 * @method GET
 * @access private
 *
 */

export const getOrdersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLastMothsData(OrderModel);

      res.status(200).json({ success: true, orders });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
