import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createCheckoutSession, getAllPurchasedCourses, getCourseDetailWithPurchaseStatus, stripeWebhook } from "../controller/coursePurchase.controller.js";

const router=express.Router();
router.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession);
router.route("/webhook").post(express.raw({type: 'application/json'}),stripeWebhook);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
router.route("/").get(isAuthenticated,getAllPurchasedCourses);

export default router;