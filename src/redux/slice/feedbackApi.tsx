import Cookies from "js-cookie";
import { baseApi } from "../baseApi";

const feedbackApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFeedbacks: build.query({
      query: () => ({
        url: `/feedbacks`,
        method: "GET",
      }),
      providesTags: ["feedback"],
    }),

    getFeedbackById: build.query({
      query: (id: string) => ({
        url: `/feedbacks/${id}`,
        method: "GET",
      }),
      providesTags: ["feedback"],
      transformResponse: (response: { data: any }) => response.data,
    }),

    createFeedback: build.mutation({
      query: (data) => ({
        url: "/feedback",
        method: "POST",
        body: data,       
      }),
      invalidatesTags: ["feedback"],
    }),

    updateFeedback: build.mutation({
      query: (data) => ({
        url: `/feedbacks/update/${data?.id}`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }),
      invalidatesTags: ["feedback"],
    }),

    deleteFeedback: build.mutation({
      query: (id: string) => ({
        url: `/feedbacks/delete/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }),
      invalidatesTags: ["feedback"],
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useGetFeedbackByIdQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} = feedbackApi;