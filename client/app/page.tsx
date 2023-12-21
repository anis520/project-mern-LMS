"use client";
import Header from "@/components/Header";
import Heading from "@/utils/Heading";
import Image from "next/image";
import { FC, useState } from "react";
interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Heading
        title="Learning"
        description="Elearning is best"
        keywords="Programing , Mern , Redux"
      />
      <Header open={open} activeItem={activeItem} setOpen={setOpen} />
    </div>
  );
};

export default Page;
