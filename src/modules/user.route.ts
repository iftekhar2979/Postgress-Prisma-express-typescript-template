import { Router } from "express";
import {resendOtp, signUp, verifyCode } from "./user.controller";
// import isValidate from "../../middlewares/auth";


const router = Router();

router.post('/register',signUp);
router.post('/verify-code',verifyCode)
// router.post("/login",login)
// router.post("/change-password",isValidate,changePassword)
router.post('/resend-otp',resendOtp)
// router.post('/forgot-password',sendOtp)
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