import express from "express";

import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  getNotfications,
  updateNotfication,
} from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAutheticated,
  authorizeRoles("admin"),
  getNotfications
);
notificationRouter.put(
  "/update/notification/:id",
  isAutheticated,
  authorizeRoles("admin"),
  updateNotfication
);

export default notificationRouter;
