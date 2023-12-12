require("dotenv").config();

import mongoose, { Document, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcript from "bcryptjs";
const emailRegexPattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const strongPassRegexPartten: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+,\-.:;<=>?@[\\]^_`{|}~])[A-Za-z\d!@#$%^&*()_+,\-.:;<=>?@[\\]^_`{|}~]{8,}$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avater: {
    pablic_id: string;
    url: string;
  };
  role: string;
  isverfied: boolean;
  courses: Array<{ courseId: string }>;

  comparePassword: (password: string) => Promise<boolean>;
  SignAceessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: {
      validator: function (value: string) {
        return emailRegexPattern.test(value);
      },
      message: "please enter a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    minlength: [5, "password must be at least 6 characters"],
    select: false,
  },
  avater: {
    pablic_id: String,
    url: String,
  },
  role: {
    type: String,
    default: "user",
  },
  isverfied: {
    type: Boolean,
    default: false,
  },
  courses: [
    {
      courseId: String,
    },
  ],
});

// hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcript.hash(this.password, 10);
  next();
});

// sign access token
userSchema.methods.SignAceessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};
// sign access token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// compare password
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcript.compare(password, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
