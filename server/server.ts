import { app } from "./app";
import connectDB from "./utils/db";
import colors from "colors";

require("dotenv").config();

// create server
app.listen(process.env.PORT, () => {
  console.log(`server is connecte with port ${process.env.PORT}`);
  connectDB();
});
