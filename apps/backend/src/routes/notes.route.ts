import { Router } from "express";
import {
	createNote,
	updateNote,
	getNote,
	getNotes,
	deleteNote,
	archiveNote,
	pinNote,
	
} from "../controllers/notes.controller.js";
import { validate } from "../middlewares/validators.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { notesValidator } from "../validators/notes.validator.js";
import { canAccessProject } from "../middlewares/project.middleware.js";
import { canAccessNote } from "../middlewares/note.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router({ mergeParams: true });

//create note and get all notes
router
	.route("/project/:projectId/notes")
	.post(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		notesValidator(),
		validate,
		createNote,
	)
	.get(rateLimiter, authMiddleware, canAccessProject, getNotes); // search or get all notes

// get single note, update note, delete note
router
	.route("/project/:projectId/notes/:noteId")
	.get(rateLimiter, authMiddleware, canAccessProject, canAccessNote, getNote)
	.patch(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		canAccessNote,
		notesValidator(),
		validate,
		updateNote,
	)
	.delete(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		canAccessNote,
		deleteNote,
	);

// actions on note
router
	.route("/project/:projectId/notes/:noteId/archive")
	.patch(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		canAccessNote,
		archiveNote,
	);

router
	.route("/project/:projectId/notes/:noteId/pin")
	.patch(
		rateLimiter,
		authMiddleware,
		canAccessProject,
		canAccessNote,
		pinNote,
	);


export default router;
