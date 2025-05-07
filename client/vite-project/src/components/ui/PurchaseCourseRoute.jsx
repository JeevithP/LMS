import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";

import { useParams, Navigate } from "react-router-dom";

export const PurchaseCourseProtectedRoute=({children})=>{
    const {courseId}=useParams();
    const {data,isLoading}=useGetCourseDetailWithStatusQuery(courseId);

    if(isLoading) return <p>Loading...</p>
    console.log(data);
    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`}/>
}