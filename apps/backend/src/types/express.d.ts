import { NoteDocument } from "./NotesModel.types.js";
import { ProjectDocument } from "./ProjectsModel.types.js";
import { TaskDocument } from "./TasksModel.types.js";
import { UserDocument } from "./UserModel.types.js";

declare global {
	namespace Express {
		interface Request {
			user?: UserDocument;
			project?: ProjectDocument;
			note?: NoteDocument;
			task?: TaskDocument;
		}
	}
}
