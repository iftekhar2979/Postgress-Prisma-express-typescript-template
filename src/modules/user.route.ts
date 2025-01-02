import { Router } from "express";
import {resendOtp, setPassword, signUp, verifyCode,loginUser } from "./user.controller";
// import isValidate from "../../middlewares/auth";


const router = Router();

router.post('/register',signUp);
router.post('/verify-code',verifyCode)
router.post("/login",loginUser)
router.post('/resend-otp',resendOtp)
router.post('/forget-password',setPassword)


export const UserRoutes = router;