import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: "",
  user: "",
};

const authSice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";
    },
  },
});
export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSice.actions;
export default authSice.reducer;
