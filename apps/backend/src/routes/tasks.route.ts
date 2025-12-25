import { Router } from "express";
import {
	createTask,
	getProjectTasks,
	getUserTasks,
	getTask,
	updateTask,
	deleteTask,
	changeTaskStatus,
} from "../controllers/tasks.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validators.middleware.js";
import { taskValidator } from "../validators/tasks.validator.js";
import { canAccessProject } from "../middlewares/project.middleware.js";
import { canAccessTask } from "../middlewares/task.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router({ mergeParams: true });

router
	.route("/projects/:projectId/tasks")
	.post(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		taskValidator(),
		validate,
		createTask,
	)
	.get(rateLimiter, authMiddleware, canAccessProject, getProjectTasks)
	.get(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		canAccessTask,
		getUserTasks,
	);

router
	.route("/projects/:projectId/tasks/:taskId")
	.get(rateLimiter, authMiddleware, canAccessProject, canAccessTask, getTask)
	.patch(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		canAccessTask,
		taskValidator(),
		validate,
		updateTask,
	)
	.delete(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		canAccessTask,
		deleteTask,
	);

router
	.route("/projects/:projectId/tasks/:taskId/status")
	.patch(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		canAccessTask,
		changeTaskStatus,
	);

export default router;
