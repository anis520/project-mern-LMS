"use client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Heading from "@/utils/Heading";
import Image from "next/image";
import { FC, useState } from "react";
interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("login");

  return (
    <div>
      <Heading
        title="Learning"
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
      <Hero />
    </div>
  );
};

export default Page;
