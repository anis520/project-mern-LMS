"use client";
import React, { FC, useState } from "react";
import RootLayout from "../layout";
import Heading from "@/utils/Heading";

interface Props {}

const Page: FC<Props> = (props) => {
  return (
    <div>
      <Heading
        title="game page"
        description="all game is free for 1 months"
        keywords="game ,kids, loading"
      />
      Game page
    </div>
  );
};

export default Page;
