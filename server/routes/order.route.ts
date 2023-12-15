import express from "express";

import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { createOrder } from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post(
  "/create-order",
  isAutheticated,

  createOrder
);

export default orderRouter;
