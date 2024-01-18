"use client";
import Header from "@/components/Header";
import Profile from "@/components/Profile/Profile";
import Hero from "@/components/Hero";
import Protected from "@/hooks/useProtected";
import Heading from "@/utils/Heading";
import Image from "next/image";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const { user } = useSelector((state: any) => state.auth);
  const [route, setRoute] = useState("login");

  return (
    <div>
      <Protected>
        <Heading
          title={`Profile - ${user?.name}`}
          description="Elearning is best"
          keywords="Programing , Mern , Redux"
        />
        <Header
          open={open}
          activeItem={activeItem}
          setOpen={setOpen}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
      </Protected>
    </div>
  );
};

export default Page;
