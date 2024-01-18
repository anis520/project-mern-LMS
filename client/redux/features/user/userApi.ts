import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),
    updateInfo: builder.mutation({
      query: (data) => ({
        url: "update-user-info",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useUpdateAvatarMutation, useUpdateInfoMutation } = userApi;
