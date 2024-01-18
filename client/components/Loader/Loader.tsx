import Image from "next/image";
import React from "react";

type Props = {};

function Loader({}: Props) {
  return (
    <div>
      <div className="w-screen h-screen bg-black bg-opacity-10 dark:bg-opacity-40 flex items-center justify-center">
        <Image
          src={require("@/public/Loading.gif")}
          width={100}
          height={100}
          alt="loader"
          className="bg-transparent"
        />
      </div>
    </div>
  );
}

export default Loader;
