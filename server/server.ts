import { v2 as clouddinary } from "cloudinary";
import { app } from "./app";
import connectDB from "./utils/db";
import colors from "colors";

require("dotenv").config();

// cloudinary config
clouddinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// create server
app.listen(process.env.PORT, () => {
  console.log(`server is connecte with port ${process.env.PORT}`);
  connectDB();
});
