import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import path from "path";
import ejs from "ejs";
import corn from "node-cron";
import sendMail from "../utils/sendMail";
import userModel from "../models/user.model";
import NotificationModel from "../models/notificationModel";

/**
 *
 * @DESC   get all notification - admin only
 * @ROUTE /api/v1/get-notification
 * @method GET
 * @access private
 *
 */

export const getNotfications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({ success: true, notifications });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/**
 *
 * @DESC  update notification - admin only
 * @ROUTE /api/v1/update/notification/:id
 * @method PUT
 * @access private
 *
 */

export const updateNotfication = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification?.status;
      }
      await notification.save();
      const notifications = await NotificationModel.find().sort({
        creaedAt: -1,
      });
      res.status(201).json({ success: true, notifications });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete notification -- only admin
corn.schedule("0 0 0  * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });

  console.log("Deleted read notifications");
});
