import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Label } from '@radix-ui/react-dropdown-menu';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteCourseMutation, useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

export default function CourseTab() {
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });

    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });
    const [publishCourse] = usePublishCourseMutation();
    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
    const [deleteCourse] = useDeleteCourseMutation();

    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "",
            });
        }
    }, [courseByIdData]);

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const selectCategory = (value) => setInput({ ...input, category: value });
    const selectCourseLevel = (value) => setInput({ ...input, courseLevel: value });

    const updateCourseHandler = async () => {
        const formData = new FormData();
        Object.entries(input).forEach(([key, value]) => {
            formData.append(key, value);
        });
        await editCourse({ formData, courseId });
    };

    const publishStatusHandler = async (action) => {
        try {
            const res = await publishCourse({ courseId, query: action });
            if (res.data) {
                refetch();
                toast.success(res.data.message);
            }
        } catch {
            toast.error("Failed to publish or unpublish course");
        }
    };

    useEffect(() => {
        if (isSuccess) toast.success(data?.message || "Course Updated");
        if (error) toast.error(error?.data?.message || "Failed to Edit Course");
    }, [isSuccess, error]);

    if (courseByIdLoading) return <Loader2 className='h-4 w-4 animate-spin' />;

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className="space-x-2">
                    <Button disabled={courseByIdData?.course.lectures.length == 0} variant="outline" onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                        {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            

                            try {
                                const res = await deleteCourse(courseId);
                                console.log(courseId);
                                console.log(res);
                                
                                if (res.data?.message) {
                                    toast.success(res.data.message);
                                    navigate("/admin/course");
                                }
                            } catch (err) {
                                toast.error("Failed to delete course");
                            }
                        }}
                    >
                        Remove Course
                    </Button>

                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <Label>Title</Label>
                    <Input type="text" name="courseTitle" placeholder="Ex. Fullstack developer" value={input.courseTitle} onChange={changeEventHandler} />

                    <Label>Subtitle</Label>
                    <Input type="text" name="subTitle" placeholder="Ex. Become a Fullstack developer from zero to hero" value={input.subTitle} onChange={changeEventHandler} />

                    <Label>Description</Label>
                    <RichTextEditor input={input} setInput={setInput} />

                    <Label>Category</Label>
                    <Select onValueChange={selectCategory}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select a Category" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                {['Next JS', 'Data Science', 'Frontend Development', 'Fullstack Development', 'Data Structures And Algorithms', 'Javascript', 'Python', 'Docker', 'MongoDB', 'HTML'].map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Label>Course Level</Label>
                    <Select onValueChange={selectCourseLevel}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select a course level" /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Course Level</SelectLabel>
                                {['Beginner', 'Intermediate', 'Advance'].map((level) => (
                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Label>Price in INR</Label>
                    <Input type="number" name="coursePrice" value={input.coursePrice} onChange={changeEventHandler} placeholder="199" className="w-fit" />

                    <Label>Course Thumbnail</Label>
                    <Input type="file" accept="image/*" className='w-fit' onChange={selectThumbnail} />
                    {previewThumbnail && <img src={previewThumbnail} className='h-50 w-60 my-2' alt='Course Thumbnail' />}

                    <Button onClick={() => navigate("/admin/course")} variant='outline'>Cancel</Button>
                    <Button disabled={isLoading} onClick={updateCourseHandler}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}</Button>
                </div>
            </CardContent>
        </Card>
    );
}
