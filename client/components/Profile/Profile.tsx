import cn from "@/utils/cn";
import React, { useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import EnrolledCourse from "./EnrolledCourse";

type Props = { user: any };

const Profile = (props: Props) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, { skip: !logout ? true : false });
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  return (
    <div className="w-[85%] flex mx-auto ">
      <div
        className={cn(
          `w-[60px] 800px:w-[310px] duration-300 h-[450px] bg-state-900 bg-opacity-90  border dark:border-[#ffffff1d] border-[#d6d4d463] overflow-hidden rounded-[5px] shadow-md dark:shadow-sm mt-[80px] mb-[80px] sticky left-[30px] top-[30px]`,
          {
            "top-[120px]": scroll,
          }
        )}
      >
        <SideBarProfile
          active={active}
          avatar={avatar}
          setActive={setActive}
          user={props?.user}
          logOutHandler={logOutHandler}
        />
      </div>{" "}
      {active == 1 && <ProfileInfo />}
      {active == 2 && <ChangePassword />}
      {active == 3 && <EnrolledCourse />}
    </div>
  );
};

export default Profile;
