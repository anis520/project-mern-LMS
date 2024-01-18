import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import {
  useUpdateAvatarMutation,
  useUpdateInfoMutation,
} from "@/redux/features/user/userApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillCamera,
  AiFillPhone,
  AiFillPicture,
  AiOutlineCamera,
} from "react-icons/ai";

type Props = { user: any; avatar: string | null };

function ProfileInfo({ user, avatar }: Props) {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [updateInfo, { isSuccess: infoSuccess, error: infoError }] =
    useUpdateInfoMutation();
  const [loadUser, SetLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  const handleImage = async (e: any) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState == 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess) {
      SetLoadUser(true);
    }
    if (infoSuccess) {
      toast.success("Profile update successfully");
      SetLoadUser(true);
    }
    if (error) {
      console.log(error);
    }
  }, [isSuccess, error, infoSuccess]);

  const nameChangeHandler = async () => {
    if (name == user?.name) {
      toast.error("updated not");
    } else {
      updateInfo({ name });
    }
  };

  return (
    <div className="mx-auto w-8/12 p-12 flex flex-col items-center  gap-4">
      <div className="relative w-[100px] h-[100px]">
        <Image
          width={100}
          height={100}
          alt={user?.name}
          src={
            user.avatar.url || avatar
              ? user.avatar.url || avatar
              : require("@/public/Avatar.png")
          }
          className=" w-[100px] 800px:h-[100px] cursor-pointer rounded-full"
        />
        <label htmlFor="image">
          <AiOutlineCamera className="absolute bottom-0 bg-white text-black hover:bg-gray-700 hover:text-white duration-300 right-0 w-[30px] h-[30px] border rounded-full  cursor-pointer p-1" />
          <input
            onChange={handleImage}
            className="hidden"
            type="file"
            id="image"
            value=""
          />
        </label>
      </div>
      <label htmlFor="name" className="text-start w-full">
        Name :
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded-md outline-none border"
      />
      <label htmlFor="name" className="text-start w-full">
        Email :
      </label>
      <input
        id="email"
        type="email"
        readOnly
        value={user?.email}
        className="w-full p-2 rounded-md outline-none border"
      />
      <button
        onClick={nameChangeHandler}
        className="text-white px-6 font-semibold py-1 rounded-md bg-blue-500 me-auto"
      >
        Udate
      </button>
    </div>
  );
}

export default ProfileInfo;
