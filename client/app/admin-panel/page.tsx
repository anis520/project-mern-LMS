"use client";

import Heading from "@/utils/Heading";
import { FC, useState } from "react";
import AdminProtected from "@/hooks/adminProtected";
interface Props {}

const Page: FC<Props> = (props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title={`Elearning - Admin`}
          description="Elearning Admin"
          keywords="Programing , Mern , Redux"
        />
        <p>Admin panel</p>{" "}
      </AdminProtected>
    </div>
  );
};

export default Page;
