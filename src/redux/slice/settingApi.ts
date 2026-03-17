import Cookies from "js-cookie";
import { baseApi } from "../baseApi";

const settingApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // 🔹 Get all settings
        getFaq: build.query({
            query: () => ({
                url: `/faqs${location.search}`,
                method: "GET",
            }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: ["setting"],
        }),
        getTermsCondition: build.query({
            query: () => ({
                url: "/settings?key=termsOfService",
                method: "GET",
            }),                     
        }),

        // 🔹 Get single setting
        getSettingById: build.query({
            query: (id: string) => ({
                url: `/settings/single/${id}`,
                method: "GET",
            }),
            providesTags: ["setting"],
            transformResponse: (response: { data: any }) => response.data,
        }),

        // 🔹 Create setting
        createSetting: build.mutation({
            query: (data) => ({
                url: "/settings/create",
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
            }),
            invalidatesTags: ["setting"],
        }),

        // 🔹 Update setting
        updateSetting: build.mutation({
            query: (data) => ({
                url: `/settings/update/${data?.id}`,
                method: "PATCH",
                body: data,
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
            }),
            invalidatesTags: ["setting"],
        }),

        // 🔹 Delete setting
        deleteSetting: build.mutation({
            query: (id: string) => ({
                url: `/settings/delete/${id}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
            }),
            invalidatesTags: ["setting"],
        }),

        // 🔹 Update status (optional if you use active/inactive toggle)
        updateSettingStatus: build.mutation({
            query: (data) => ({
                url: `/settings/status/${data?.id}`,
                method: "PATCH",
                body: data,
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
            }),
            invalidatesTags: ["setting"],
        }),
    }),
});

export const {
    useGetFaqQuery,
    useGetTermsConditionQuery,
    useGetSettingByIdQuery,

    useCreateSettingMutation,
    useUpdateSettingMutation,
    useDeleteSettingMutation,
    useUpdateSettingStatusMutation,
} = settingApi;