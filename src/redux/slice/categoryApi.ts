import Cookies from "js-cookie";
import { baseApi } from "../baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => ({
        url: `/categories${location.search}`,
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    getCategoryById: build.query({
      query: (id: string) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["category"],
      transformResponse: (response: { data: any }) => response.data,
    }),

    createCategory: build.mutation({
      query: (data) => ({
        url: "/categories/create",
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }),
      invalidatesTags: ["category"],
    }),

    updateCategory: build.mutation({
      query: (data) => ({
        url: `/categories/update/${data?.id}`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }),
      invalidatesTags: ["category"],
    }),

    deleteCategory: build.mutation({
      query: (id: string) => ({
        url: `/categories/delete/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,

  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;