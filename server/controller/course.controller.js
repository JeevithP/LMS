import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse=async(req,res)=>{
    try{
        const {courseTitle,category}=req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                message:"Course title and category are required."
            })
        }
        const course=await Course.create({
            courseTitle,
            category,
            creator:req.id,
        })
        return res.status(201).json({
            course,
            message:"Course Created Suceesfully."
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Failed To Create Course"
        })
    }
}
export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}
export const editCourse=async(req,res)=>{
    try{
        const courseId=req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;
        console.log(req.params);
        let course=await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course Not Found"
            })
        }
        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId=course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // deleted old image
            } 
            courseThumbnail=await uploadMedia(thumbnail.path)
        }
        //upload thumbnail to cloudinary
        const updateData={courseTitle,subTitle,description, category, courseLevel, coursePrice,courseThumbnail:courseThumbnail?.secure_url};
        //console.log(updateData);

        course=await Course.findByIdAndUpdate(courseId,updateData,{new:true});
        return res.status(200).json({
            course,
            message:"Course Edited Successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Failed To Edit course"
        })
    }
}

export const getCourseById=async(req,res)=>{
    try{
        const courseId=req.params.courseId;

        const course =await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course Not Found"
            })
        }
        return res.status(200).json({
            course
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Failed To Get course"
        })
    }
}
export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        };

        // create lecture
        const lecture = await Lecture.create({lectureTitle});

        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message:"Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        })
    }
}
export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures:course.lectures,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lectures"
        })
    }
}
export const editLecture=async(req,res)=>{
    try{
        const {lectureTitle,isPreviewFree,videoInfo}=req.body;
        const {courseId,lectureId}=req.params;
        const lecture=await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture Not Found"
            })
        }
        //update lecture
        // console.log(videoInfo);
        if(lectureTitle) lecture.lectureTitle=lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl=videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId=videoInfo.publicId;
        lecture.isPreviewFree=isPreviewFree;

        await lecture.save();

        //ensure course is still having lectureId if it was not already had
        const course=await Course.findById(courseId);
        // console.log(course);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully."
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lectures"
        })
    }
}
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures:lectureId}, // find the course that contains the lecture
            {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by id"
        })
    }
}
//publish unpublished course
export const togglePublishCourse=async(req,res)=>{
    try{
        const {courseId}=req.params;
        const {publish}=req.query;
        const course=await Course.findById(courseId);
        // console.log(course);
        if(!course){
            return res.status(404).json({
                message:"Course Not Found"
            })
        }

        course.isPublished=publish==="true";
        await course.save();
        const statusMessage=course.isPublished?"Published":"UnPublished";

        return res.status(200).json({
            message:`Course is ${statusMessage}`
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Failed To Update Status"
        })
    }
}
export const searchCourse = async (req, res) => {
    try {
      let { query = "", categories = "", sortByPrice = "" } = req.query;
  
      // 1) Normalize categories into an array
      // If categories is a single string "nextjs,Data Science", split it.
      if (typeof categories === "string") {
        categories = categories
          .split(",")
          .map(cat => cat.trim())
          .filter(cat => cat.length);
      }
  
      // Base search criteria
      const searchCriteria = {
        isPublished: true,
        $or: [
          { courseTitle: { $regex: query, $options: "i" } },
          { subTitle:     { $regex: query, $options: "i" } },
          { category:     { $regex: query, $options: "i" } },
        ],
      };
  
      // 2) If any categories selected, add case‑insensitive match
      if (Array.isArray(categories) && categories.length > 0) {
        searchCriteria.category = {
          $in: categories.map(cat => new RegExp(`^${cat}$`, "i"))
        };
      }
  
      // 3) Sorting
      const sortOptions = {};
      if (sortByPrice === "low")  sortOptions.coursePrice = 1;
      if (sortByPrice === "high") sortOptions.coursePrice = -1;
  
      // 4) Execute query
      const courses = await Course
        .find(searchCriteria)
        .populate({ path: "creator", select: "name photoUrl" })
        .sort(sortOptions);
  
      return res.status(200).json({ success: true, courses });
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

export const getPublishedCourse = async (_,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published courses"
        })
    }
}
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete course" });
    }
};
export const getNumberOfStudents=async(req,res)=>{
    try{
        const {courseId}=req.params;
        const course=await Course.findById(courseId).populate("enrolledStudents");
        if(!course){
            return res.status(404).json({
                message:"Course Not Found"
            })
        }
        return res.status(200).json({
            count:course.enrolledStudents.length
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Failed to get number of students"
        })
    }
}
