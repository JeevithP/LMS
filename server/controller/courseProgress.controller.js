import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        // Step 1: Fetch the user's course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");

        // Step 2: Fetch the course details
        const courseDetail = await Course.findById(courseId).populate("lectures");
        if (!courseDetail) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Step 3: If course progress is not found, return course details with empty progress
        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetail,
                    completed: false,
                    progress: []
                }
            });
        }

        // Step 4: Return the user's course progress along with course details
        return res.status(200).json({
            data: {
                courseDetail,
                completed: courseProgress.completed, // Use courseProgress.completed
                progress: courseProgress.lectureProgress // Use courseProgress.lectureProgress
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while fetching course progress"
        });
    }
};
export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        //step-1 find the course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) {
            //if no course progress found then create a new course progress
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            })
        }
        //step-2 find the lecture progress
        let lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);
        if (lectureIndex !== -1) {
            //if lecture already exist,update its status
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }
        else {
            //add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed: true
            })
        }
        // if all lecture is completed then mark course as completed
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;
        const course = await Course.findById(courseId);
        if (lectureProgressLength === course.lectures.length) {
            courseProgress.completed = true;
        }
        //save the course progress
        await courseProgress.save();
        return res.status(200).json({
            message: "Lecture progress updated"
        })
    } catch (error) {
        console.log(error);
    }
}
export const markAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        //find the course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) {
            return res.status(404).json({
                message: "Course progress not found"
            })
        }
        //mark all lectures as completed
        courseProgress.lectureProgress = courseProgress.lectureProgress.map((lecture) => ({
            ...lecture,
            viewed: true
        }));
        courseProgress.completed = true;
        //save the course progress
        await courseProgress.save();
        return res.status(200).json({
            message: "Course marked as completed"
        })
    } catch (error) {
        console.log(error);
    }
}
export const markAsInCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        //find the course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) {
            return res.status(404).json({
                message: "Course progress not found"
            })
        }
        //mark all lectures as completed
        courseProgress.lectureProgress = courseProgress.lectureProgress.map((lecture) => ({
            ...lecture,
            viewed: false
        }));
        courseProgress.completed = false;
        //save the course progress
        await courseProgress.save();
        return res.status(200).json({
            message: "Course marked as incompleted"
        })
    } catch (error) {
        console.log(error);
    }
}