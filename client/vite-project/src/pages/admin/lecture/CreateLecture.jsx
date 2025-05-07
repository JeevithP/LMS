import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

export default function CreateLecture() {
    const [lectureTitle, setLectureTitle] = useState("");
    const params = useParams();
    const navigate = useNavigate();
    const courseId = params.courseId;

    const [createLecture, { data, isLoading, error, isSuccess }] = useCreateLectureMutation();
    const { data: lectureData, isLoading: lectureLoading, isError: lectureError ,refetch} = useGetCourseLectureQuery(courseId);

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    }
    
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                refetch();
            }, 500); // Small delay to ensure API update
            toast.success(data.message || "Lecture Created Successfully");
        }
        if (error) {
            toast.error(error.data?.message || "Failed To Create Lecture");
        }
    }, [isSuccess, error]);
    

    return (
        <div className='flex-1 mx-10'>
            <div className='mt-4'>
                <h1 className='font-bold text-xl'> Let's Add Lectures, add some basic details of the new course</h1>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, velit.</p>
            </div>
            <div className='mt-5 space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input type="text" name="courseTitle" placeholder="Your Title Name" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
                </div>

                <div className='flex items-center gap-2'>
                    <Button variant='outline' onClick={() => navigate(`/admin/course/${courseId}`)}>Back To Course</Button>
                    <Button onClick={createLectureHandler}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                </>
                            ) : "Create Lecture"
                        }
                    </Button>
                </div>
                <div className='mt-10'>
                    {
                        lectureLoading ? (<p>Loading Lecture...</p>) : lectureError ? (<p>Failed to load Lectures</p>) : lectureData.lectures.length === 0 ? <p>No Lectures Available</p> : (
                            lectureData.lectures.map((lecture,index)=>{
                                return <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId}/>
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
}
