import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle, CirclePlay } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function CourseProgress() {
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSucess }] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] = useInCompleteCourseMutation();
  const [currentLecture, setCurrentLecture] = useState(null);
  useEffect(() => {
    if (completedSucess) {
      refetch();
      toast.success(markCompleteData.message)
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message)
    }
  }, [completedSucess, inCompletedSuccess])
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Failed to load course progress</h1>;
  }

  // Add fallback values for undefined data
  const { courseDetail = {}, completed = false, progress = [] } = data.data || {};
  const { courseTitle = "", lectures = [] } = courseDetail;

  // Initialize the current lecture if not already set
  const initialLecture = currentLecture || (lectures.length > 0 ? lectures[0] : null);

  const isLectureCompleted = (lectureId) => {
    return Array.isArray(progress) && progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);

  }
  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  }


  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button onClick={completed ? handleInCompleteCourse : handleCompleteCourse} variant={completed ? "outline" : "default"}>
          {completed ? <div className='flex items-center'><CheckCircle className='h-4 w-4 mr-2' /> <span>Completed</span></div> : "Mark as Completed"}

        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() => handleLectureProgress(currentLecture?._id || initialLecture._id)}
            ></video>
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture ${lectures.findIndex((lec) => lec._id === (currentLecture?._id || initialLecture?._id)) + 1
                }: ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`}
            </h3>
          </div>
        </div>
        {/* Lecture sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id ? `bg-gray-200 dark:bg-gray-800` : ``
                  }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={20} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">{lecture.lectureTitle}</CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge variant="outline" className="bg-green-200 text-green-600">
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}