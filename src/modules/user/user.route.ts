import { Router } from "express";
import {resendOtp, setPassword, signUp, verifyCode,loginUser } from "./user.controller";
// import isValidate from "../../middlewares/auth";


const router = Router();

router.post('/register',signUp);
router.post('/verify-code',verifyCode)
router.post("/login",loginUser)
// router.post("/change-password",isValidate,changePassword)
router.post('/resend-otp',resendOtp)
router.post('/forget-password',setPassword)
// router.post('/forgot-password-change',isValidate,changePasswordWithForgot)
// router.post('/set-password',setPassword)
// // router.post(
//   '/login',
//   validationMiddleware(UserValidations.userLoginUserValidationSchema),
//   UserControllers.loginUser,
// );
// router.post(
//   '/change-password',
//   authMiddleware("admin","user"),
//   validationMiddleware(UserValidations.passwordChangeValidationSchema),
//   UserControllers.userChangePassword,
// );

export const UserRoutes = router;