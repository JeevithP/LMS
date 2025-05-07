import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:3000/api/v1/course/";

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ['Refetch_Creater_Course', 'Refetch_Lecture'],

    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: "POST",
                body: { courseTitle, category },
            }),
            invalidatesTags: ['Refetch_Creater_Course']
        }),
        getSearchCourses: builder.query({
            query: ({ searchQuery, categories, sortByPrice }) => {
                //build query string
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`
                // append category
                if (categories && categories.length > 0) {
                    const categoriesString = categories.map(encodeURIComponent).join(",")
                    queryString += `&categories=${categoriesString}`;

                }
                //apend sortBYPrice
                if (sortByPrice) {
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`
                }

                return {
                    url: queryString,
                    method: "GET"
                }

            }
        }),
        getPublishedCourse: builder.query({
            query: () => ({
                url: "/published-courses",
                method: "GET",
            }),
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: ['Refetch_Creater_Course']
        }),
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ['Refetch_Creater_Course']
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `${courseId}`,
                method: "GET",
            }),
            providesTags: ['Refetch_Creater_Course']
        }),
        createLecture: builder.mutation({
            query: ({ lectureTitle, courseId }) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: { lectureTitle }, // Sends only the title in the body
            })
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET",
            }),
            providesTags: ['Refetch_Lecture']
        }),

        editLecture: builder.mutation({
            query: ({ lectureTitle, isPreviewFree, videoInfo, courseId, lectureId }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: 'POST',
                body: {
                    lectureTitle, videoInfo, isPreviewFree
                }
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'DELETE',

            }),
            invalidatesTags: ['Refetch_Lecture']
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'GET',
            }),

        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: "PATCH",
            }),
        }),
        deleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `/delete/${courseId}`,
                method: "DELETE",
            }),
        }),
        getNumberOfStudents:builder.query({
            query: (courseId) => ({
                url: `/${courseId}/students`,
                method: "GET",
            }),
        })

    })

});

export const {
    useCreateCourseMutation,
    useGetSearchCoursesQuery,
    useGetCreatorCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation,
    useGetPublishedCourseQuery,
    useDeleteCourseMutation,
    useGetNumberOfStudentsQuery
} = courseApi;