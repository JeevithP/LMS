import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import { Label } from '@radix-ui/react-dropdown-menu'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

import React, { useEffect, useState } from 'react'
import { useFetcher, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_API = "http://localhost:3000/api/v1/media";

export default function LectureTab() {
    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);
    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
    const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();

    const navigate = useNavigate();
    const params = useParams();
    const { courseId, lectureId } = params;
    const {data:lectureData}=useGetLectureByIdQuery(lectureId);
    const lecture=lectureData?.lecture;

    useEffect(()=>{
        if(lecture){
            setLectureTitle(lecture.lectureTitle);
            setIsFree(lecture.isPreviewFree);
            setUploadVideoInfo(lecture.videoInfo);
        }
    },[lecture])

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(1);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    }
                })
                if (res.data.success) {
                    // console.log(res);
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setBtnDisable(0);
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("Video Upload Failed");
            } finally {
                setMediaProgress(0);
            }
        }
    }
    const editLectureHandler = async () => {
        const res =await editLecture({ lectureTitle, videoInfo: uploadVideoInfo, isPreviewFree: isFree, courseId, lectureId });
        console.log(res);
    }
    const removeLectureHandler = async () => {
        const res = await removeLecture(lectureId);
        // console.log(res);
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message);
        }
        if (error) {
            toast.error(error.data.message);
        }
    }, [isSuccess, error])

    useEffect(() => {
        if (removeSuccess) {
            toast.success(removeData.message);
            navigate(-1);
        }

    }, [removeSuccess])
    // console.log(isFree)
    return (
        <Card>
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make Changes and click save when done.</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button disable={removeLoading} variant='destructive' onClick={removeLectureHandler}>
                        {
                            removeLoading ? <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please Wait
                            </> : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        type='text'
                        placeholder='Ex.Introduction To JavaScript'
                    />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input
                        type='file'
                        accept='video/*'
                        onChange={fileChangeHandler}
                        placeholder='Ex.Introduction To JavaScript'
                        className='w-fit'
                    />
                </div>
                <div className='flex items-center space-x-2 my-5'>
                    <Switch checked={isFree} onCheckedChange={()=>setIsFree(!isFree)} id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Is This Video FREE</Label>
                </div>
                <div>
                    {
                        mediaProgress && (
                            <div className='my-4'>
                                <Progress value={uploadProgress} />
                                <p>{uploadProgress}% uploaded</p>
                            </div>
                        )
                    }
                </div>
                <div className='mt-4'>
                    <Button disabled={isLoading} onClick={editLectureHandler}>
                        {
                            isLoading ? <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please Wait
                            </> : "Update Lecture"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
