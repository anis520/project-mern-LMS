import Image from "next/image";
import React from "react";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="md:flex w-11/12 md:w-full m-auto items-center justify-between pb-10">
      <Image
        src={require("../public/banner.gif")}
        width={250}
        height={250}
        alt="banner"
        className=" w-10/12 dark:bg-slate-400   p-1  my-10 md:w-4/12 mx-auto rounded-full border "
      />
      <div className="md:w-6/12">
        <h3 className="text-5xl  font-bold">
          Improve your learning skills with us{" "}
        </h3>
        <p className=" text-lg my-4">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque,
          est. Similique quia hic sapiente odit maxime doloribus reprehenderit
          ratione commodi!
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            className="w-8/12 md:w-6/12 bg-slate-100 p-2 rounded-md outline-none border border-gray-400 dark:text-black"
          />
          <button className="bg-blue-600 text-white p-2 font-semibold rounded-md">
            Search
          </button>
        </div>
        {/* <===========group avatar ================>  */}

        <div className="flex items-center py-5 -space-x-2">
          <Image
            src={require("../public/banner.gif")}
            width={35}
            height={35}
            alt="banner"
            className="    rounded-full   border border-blue-500"
          />
          <Image
            src={require("../public/banner.gif")}
            width={35}
            height={35}
            alt="banner"
            className="    rounded-full   border border-blue-500"
          />
          <Image
            src={require("../public/banner.gif")}
            width={35}
            height={35}
            alt="banner"
            className="    rounded-full  border border-blue-500 "
          />
          <Image
            src={require("../public/banner.gif")}
            width={35}
            height={35}
            alt="banner"
            className="    rounded-full  border border-blue-500 "
          />
          <p className="ps-5 font-semibold">
            +500 students joined this platfrom
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
