import Stripe from 'stripe';
import { Course } from '../models/course.model.js';
import { CoursePurchase } from '../models/coursePurchase.model.js';
import { Lecture } from '../models/lecture.model.js';
import { User } from '../models/user.model.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        //create a new course purchase record
        const newPurchase = new CoursePurchase({
            courseId: courseId,
            userId: userId,
            amount: course.coursePrice,
            status: "pending"
        })
        //create stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: course.courseTitle,
                        },
                        unit_amount: course.coursePrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
            cancel_url: `http://localhost:5173/course-detail/${courseId}`,
            metadata: {
                courseId: courseId,
                userId: userId,
            },
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
        });

        if (!session.url) {
            return res.status(400).json({
                message: "Failed to create checkout session"
            })
        }
        //save the purchase record
        newPurchase.paymentId = session.id;
        await newPurchase.save();

        return res.status(200).json({
            success: true,
            url: session.url
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create checkout session"
        })
    }
}
export const stripeWebhook = async (req, res) => {
    console.log("👉 Stripe Webhook HIT");
    let event;

    try {
        const signature = req.headers['stripe-signature'];
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        event = stripe.webhooks.constructEvent(req.body, signature, secret);
        console.log("✅ Webhook received:", event.type);
    } catch (error) {
        console.error("❌ Webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        console.log("✅ Stripe payment successful");

        try {
            const session = event.data.object;

            const purchase = await CoursePurchase.findOne({
                paymentId: session.id,
            }).populate({ path: "courseId" });

            if (!purchase) {
                console.log("❌ Purchase not found for session:", session.id);
                return res.status(404).json({ message: "Purchase not found" });
            }

            // ✅ Update purchase status
            purchase.status = "completed";
            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }
            await purchase.save();

            // ✅ Unlock lectures (optional)
            if (purchase.courseId?.lectures?.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreviewFree: true } }
                );
            }

            // ✅ Enroll user
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } },
                { new: true }
            );

            // ✅ Add student to course
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } },
                { new: true }
            );

            console.log("✅ User enrolled and course updated.");
        } catch (error) {
            console.error("❌ Error handling checkout.session.completed:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    res.status(200).send(); // Required for Stripe to acknowledge receipt
};

export const getCourseDetailWithPurchaseStatus=async(req,res)=>{
    try{
        const {courseId}=req.params;
        const userId=req.id;
        const course=await Course.findById(courseId).populate({path:"creator"}).populate({path:"lectures"});
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        const purchased=await CoursePurchase.findOne({courseId:courseId,userId:userId});
        console.log(purchased);
        return res.status(200).json({
            course,
            purchased:!!purchased // make it boolean
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course detail"
        })
    }
};
export const getAllPurchasedCourses=async(_,res)=>{
    try{
        
        const purchasedCourses=await CoursePurchase.find({status:"completed"}).populate("courseId");
        if(!purchasedCourses){
            return res.status(404).json({
                message:"No purchased courses found",
                purchasedCourses:[]
            })
        }
        return res.status(200).json({
            purchasedCourses
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Failed to get purchased courses"
        })
    }
}

