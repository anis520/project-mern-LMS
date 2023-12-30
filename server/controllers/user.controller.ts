import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel, { IUser } from "../models/user.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import cloudinary from "cloudinary";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/userService";

/**
 *
 * @DESC  register user
 * @ROUTE /api/v1/registration
 * @method POST
 * @access public
 *
 */

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails//activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email : ${user.email} to activate you account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};
/**
 *
 * @DESC  Activation user
 * @ROUTE /api/v1/activate-user
 * @method POST
 * @access public
 *
 */

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode != activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user = await userModel.create({ name, email, password });
      user.isverfied = true;
      await user.save();
      res.status(201).json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 *
 * @DESC login user
 * @ROUTE /api/v1/login
 * @method POST
 * @access public
 *
 */

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");
      // check email
      if (!user) {
        return next(new ErrorHandler("Invalied email", 400));
      }
      const isPasswordMatch = await user.comparePassword(password);
      // check password
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Password not match", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {}
  }
);

/**
 *
 * @DESC  logout user
 * @ROUTE /api/v1/logout
 * @method GET
 * @access public
 *
 */
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      // delete from redis
      redis.del(req.user?._id);

      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 *
 * @DESC  update  user accesstoken
 * @ROUTE /api/v1/refreshtoken
 * @method GET
 * @access private
 *
 */

export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Could not refresh token", 400));
      }
      const redisSession = await redis.get(decoded.id as string);
      if (!redisSession) {
        return next(
          new ErrorHandler("Please login for access this resource", 400)
        );
      }

      const user = JSON.parse(redisSession);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "3d" }
      );

      req.user = user;
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);
      await redis.set(user._id, JSON.stringify(user), "EX", 604800);
      res.status(200).json({ status: "success", accessToken });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 *
 * @DESC   get user info
 * @ROUTE /api/v1/me
 * @method GET
 * @access private
 *
 */

export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userid = req.user?._id;
      getUserById(userid, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
/**
 *
 * @DESC   social auth
 * @ROUTE /api/v1/social-auth
 * @method POST
 * @access private
 *
 */
interface ISocialAuthBody {
  email: string;
  name: string;
  avater: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avater } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avater });
        sendToken(newUser, 200, res);
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
/**
 *
 * @DESC   update user info
 * @ROUTE /api/v1/update-user-info
 * @method PUT
 * @access private
 *
 */
interface IUpdateUserInfo {
  email: string;
  name: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);
      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("Email already exist", 400));
        }
        user.email = email;
      }
      if (name && user) {
        user.name = name;
      }

      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
/**
 *
 * @DESC   update user password
 * @ROUTE /api/v1/update-user-password
 * @method PUT
 * @access private
 *
 */
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updateUserPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter password", 400));
      }
      const user = await userModel.findById(req.user?._id).select("+password");
      if (user?.password == undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }
      const isPasswordMatch = await user?.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;
      await user.save();
      await redis.set(req.user?._id, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
/**
 *
 * @DESC   update user avatar
 * @ROUTE /api/v1/update-user-avatar
 * @method PUT
 * @access private
 *
 */
interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (avatar && user) {
        if (user?.avatar?.public_id) {
          cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "lms/avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 *
 * @DESC  Get all users -- only admin
 * @ROUTE /api/v1/get-users
 * @method GET
 * @access private
 *
 */

export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 *
 * @DESC  update  user role -- only admin
 * @ROUTE /api/v1/update-user-role
 * @method PUT
 * @access private
 *
 */

interface IUserRoleUdate {
  id: string;
  role: string;
}

export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body as IUserRoleUdate;
      updateUserRoleService(res, id, role);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 *
 * @DESC  Delete  user -- only admin
 * @ROUTE /api/v1/delete-user/:id
 * @method DELETE
 * @access private
 *
 */

export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await user.deleteOne({ id });

      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
