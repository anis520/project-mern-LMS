"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/style";

import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { signIn } from "next-auth/react";
type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email !")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your Password !").min(6),
});
const Login: FC<Props> = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, error, data }] = useLoginMutation();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Login successful";
      toast.success(message);
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Login with Testing</h1>
      <form onSubmit={handleSubmit}>
        <label className={`${styles.label}`} htmlFor="email">
          Enter your email
        </label>
        <input
          type="email"
          name=""
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="loginmail@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"}  ${
            styles.input
          } `}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label className={`${styles.label}`} htmlFor="password">
            Enter your password
          </label>
          <input
            type={!show ? "password" : "text"}
            name=""
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password"
            className={`${
              errors.password && touched.password && "border-red-500"
            }  ${styles.input} `}
          />
          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )}
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        <div className="w-full mt-5 ">
          <input
            type="submit"
            value="Login"
            className={` ${styles.button}  `}
          />
          <br />
          <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
            Or join with
          </h5>
          <div className="flex items-center justify-center my-3 ">
            <FcGoogle
              onClick={() => signIn("google")}
              size={30}
              className="cursor-pointer mr-2"
            />
            <AiFillGithub
              onClick={() => signIn("github")}
              size={30}
              className="cursor-pointer ml-2"
            />
          </div>
          <h5 className="text-center pt-4 font-Poppins text-[14px]">
            Not have any account ?{" "}
            <span
              className="text-[#2190ff] pl-1 cursor-pointer"
              onClick={() => setRoute("Sign-Up")}
            >
              sing up
            </span>
          </h5>
          <br />
        </div>
      </form>
    </div>
  );
};

export default Login;
