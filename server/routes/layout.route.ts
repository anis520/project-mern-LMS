import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

import {
  createLayout,
  getLayoutByType,
  updateLayout,
} from "../controllers/layout.controller";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAutheticated,
  authorizeRoles("admin"),

  createLayout
);
layoutRouter.put(
  "/update-layout",
  isAutheticated,
  authorizeRoles("admin"),

  updateLayout
);
layoutRouter.get(
  "/get-layout",
  isAutheticated,
  authorizeRoles("admin"),

  getLayoutByType
);

export default layoutRouter;
