import { Router } from "express";
import {
	register,
	login,
	logout,
	getCurrentUser,
	verifyEmail,
	resendEmailVerificationMail,
	renewAccessToken,
	forgotPasswordRequest,
	changeCurrentPassword,
	resetForgotPassword,
	deleteUser,
} from "../controllers/auth.controller.js";
import {
	userRegistervalidator,
	userLoginValidator,
	changePasswordValidator,
	forgotPasswordValidator,
	resetPasswordValidator,
} from "../validators/auth.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validators.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router
	.route("/register-user")
	.post(rateLimiter, userRegistervalidator(), validate, register);
router
	.route("/login-user")
	.post(rateLimiter, userLoginValidator(), validate, login);
router.route("/logout-user").post(rateLimiter, authMiddleware, logout);
router.route("/verify-email/:verificationToken").get(rateLimiter, verifyEmail);
router
	.route("/resend-email-verification")
	.post(rateLimiter, authMiddleware, resendEmailVerificationMail);
router.route("/refresh-token").post(renewAccessToken);
router
	.route("/forgot-password")
	.post(
		rateLimiter,
		forgotPasswordValidator(),
		validate,
		forgotPasswordRequest,
	);
router
	.route("/reset-password/:resetToken")
	.patch(
		rateLimiter,
		resetPasswordValidator(),
		validate,
		resetForgotPassword,
	);
router
	.route("/change-password")
	.patch(
		rateLimiter,
		authMiddleware,
		changePasswordValidator(),
		validate,
		changeCurrentPassword,
	);
router
	.route("/get-current-user")
	.get(rateLimiter, authMiddleware, getCurrentUser);
router.route("/delete-user").delete(rateLimiter, authMiddleware, deleteUser);

export default router;
