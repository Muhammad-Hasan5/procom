import { Router } from "express";
import {
	createProject,
	updateProject,
	deleteProject,
	getSingleProject,
	getUserProjects,
	addMemberToProject,
	removeMemberFromProject,
	getProjectOverview,
} from "../controllers/project.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { projectValidator } from "../validators/project.validator.js";
import { validate } from "../middlewares/validators.middleware.js";
import { canAccessProject } from "../middlewares/project.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Create & get all projects of logged-in user
router
	.route("/projects")
	.post(
		rateLimiter,
		authMiddleware,
		projectValidator(),
		validate,
		createProject,
	)
	.get(rateLimiter, authMiddleware, getUserProjects);

// Get, update, delete one project
router
	.route("/projects/:projectId")
	.get(rateLimiter, authMiddleware, canAccessProject, getSingleProject)
	.patch(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		projectValidator(),
		validate,
		updateProject,
	)
	.delete(rateLimiter, authMiddleware, canAccessProject, deleteProject);

//project overview
router
	.route("/projects/:projectId/overview")
	.get(rateLimiter, authMiddleware, canAccessProject, getProjectOverview);

// Manage project members
router
	.route("/projects/:projectId/members")
	.post(rateLimiter, authMiddleware, canAccessProject, addMemberToProject);

router
	.route("/projects/:projectId/members/:memberId")
	.delete(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		removeMemberFromProject,
	);

export default router;
