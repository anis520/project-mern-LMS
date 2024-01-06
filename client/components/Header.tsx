import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import CustomModel from "../utils/CustomModel";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  useLogOutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const { data } = useSession();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, { skip: !logout ? true : false });
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();

  const [openSidbar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const handleClose = (e: any) => {
    if (e.target.id == "screen") {
      setOpenSidebar(false);
    }
  };
  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data?.user?.email,
          avatar: data?.user?.image,
          name: data?.user?.name,
        });
      }
      if (isSuccess) {
        toast.success("login successfully");
      }
    }

    if (data == null) {
      setLogout(true);
    }
  }, [data, user, isSuccess, socialAuth]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.screenY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleMobileMenu = () => {
    setOpen(true);
    setOpenSidebar(false);
  };
  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1C] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c]  h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                Testing
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>{" "}
              {user ? (
                <Link href={"/profile"}>
                  <Image
                    width={30}
                    height={30}
                    alt="user"
                    className="hidden 800px:block cursor-pointer rounded-full"
                    src={
                      user.avatar
                        ? user.avatar.url
                        : require("../public/Avatar.png")
                    }
                  />{" "}
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {openSidbar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top0 right-0 ">
              <NavItems activeItem={activeItem} isMobile={true} />
              {user ? (
                <Link href={"/profile"}>
                  <Image
                    width={30}
                    height={30}
                    alt="user"
                    className="ml-5 my-2  cursor-pointer rounded-full"
                    src={
                      user?.avatar
                        ? user?.avatar?.url
                        : require("../public/Avatar.png")
                    }
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className=" cursor-pointer ml-5 my-2 text-black dark:text-white"
                  onClick={handleMobileMenu}
                />
              )}

              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright C 2023 Testing
              </p>
            </div>
          </div>
        )}
      </div>
      {route == "login" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}
      {route == "Sign-Up" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route == "verification" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
