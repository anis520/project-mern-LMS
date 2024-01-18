import { useUpdatePasswordMutation } from "@/redux/features/auth/authApi";
import React, { useState } from "react";

type Props = {};

function ChangePassword({}: Props) {
  const [input, setInput] = useState({
    oldPassword: "",
    conPassword: "",
    newPassword: "",
  });
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const handleUpdatePassword = () => {
    updatePassword({
      oldPassword: input.oldPassword,
      newPassword: input.newPassword,
    });
  };
  const handleInput = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="p-10">
      <p className="text-xl py-4">Change your password</p>
      <hr className="mb-4" />

      <div className="space-y-3">
        <label htmlFor="oldPass">Old Password</label>
        <input
          type="password"
          name="oldPassword"
          value={input.oldPassword}
          onChange={handleInput}
          id="oldPass"
          className="border w-full rounded-md p-1"
        />
        <label htmlFor="newPass">New Password</label>
        <input
          type="password"
          name="newPassword"
          value={input.newPassword}
          onChange={handleInput}
          id="newPass"
          className="border w-full rounded-md p-1"
        />
        <label htmlFor="conPass">Confrom Password</label>
        <input
          type="password"
          name="conPassword"
          value={input.conPassword}
          onChange={handleInput}
          id="conPass"
          className="border w-full rounded-md p-1"
        />
        <button
          onClick={handleUpdatePassword}
          className="bg-blue-500 text-white w-4/12  p-1 rounded-md text-xl"
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
