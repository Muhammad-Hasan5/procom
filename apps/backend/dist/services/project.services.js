import { Project } from "../models/projects.model";
import { User } from "../models/users.model";
import { Task } from "../models/tasks.model";
import { Note } from "../models/notes.model";
import { normalizetasksStats } from "./helpers/normalizeTasksStats";
async function getProjectMembersFromDB(userId, projectId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const project = await Project.findById(projectId);
    if (!project) {
        throw new Error("User not found");
    }
    const projectMembers = await project.populate({
        path: "members",
        select: "_id fullname username email avatar",
    });
    return projectMembers;
}
export async function buildProjectOverviewFromDB(userId, projectId) {
    const project = await Project.findById(projectId);
    const projectMembers = await getProjectMembersFromDB(userId, projectId);
    const taskStats = await Task.aggregate([
        { $match: { projectId } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                count: -1,
            },
        },
    ]);
    const recentNotes = await Note.find({ project: projectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title createdAt");
    return {
        project,
        projectMembers,
        taskSummary: normalizetasksStats(taskStats),
        recentNotes,
    };
}
