import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Lecture({ lecture, index, courseId }) {
  const navigate = useNavigate();
  const goToUpdateLecture = () => {
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`)
  }
  return (
    <div className='flex items-center justify-between bg-[#F7F9FA} dark:bg-[#1F1F1F] px4 py-2 rounded-md my-2'>
      <h1 className='font-bold text-gray-800 dark:text-gray-100'>{lecture.lectureTitle}</h1>
      <Edit
        className='cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 drak:hover:text-blue-400'
        size={20}
        onClick={goToUpdateLecture}
      />
    </div>
  )
}
