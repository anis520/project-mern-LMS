import cn from "@/utils/cn";
import Image from "next/image";
import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: () => void;
};

function SideBarProfile({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}: Props) {
  return (
    <div className="w-full   ">
      <div
        className={cn(
          `w-full flex items-center px-3 py-4 cursor-pointer bg-transparent duration-200`,
          { "dark:bg-slate-800 bg-white ": active == 1 }
        )}
        onClick={() => setActive(1)}
      >
        <Image
          width={50}
          height={50}
          alt={user?.name}
          src={
            user.avatar.url || avatar
              ? user.avatar.url || avatar
              : require("@/public/Avatar.png")
          }
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
        />
        <h5 className="pl-2 800px:block hidden  dark:text-white  font-Poppins">
          My Account
        </h5>
      </div>
      <div
        className={cn(
          `w-full flex items-center px-3 py-4 cursor-pointer bg-transparent duration-200 `,
          { "dark:bg-slate-800 bg-white ": active == 2 }
        )}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="dark:text-white" />
        <h5 className="pl-2 800px:block hidden  dark:text-white  font-Poppins">
          Change Password
        </h5>
      </div>
      <div
        className={cn(
          `w-full flex items-center px-3 py-4 cursor-pointer bg-transparent  duration-200`,
          { "dark:bg-slate-800 bg-white ": active == 3 }
        )}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="dark:text-white" />
        <h5 className="pl-2 800px:block hidden  dark:text-white  font-Poppins">
          Enrolled Courses{" "}
        </h5>
      </div>
      <div
        className={cn(
          `w-full flex items-center px-3 py-4 cursor-pointer bg-transparent  duration-200`,
          { "dark:bg-slate-800 bg-white ": active == 4 }
        )}
        onClick={logOutHandler}
      >
        <AiOutlineLogout size={20} className="dark:text-white" />
        <h5 className="pl-2 800px:block hidden  dark:text-white  font-Poppins">
          Log Out
        </h5>
      </div>
    </div>
  );
}

export default SideBarProfile;
