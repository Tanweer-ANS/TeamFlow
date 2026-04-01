import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo } = req.body;

    // Ensure project belongs to org
    const project = await Project.findOne({
      _id: projectId,
      organization: req.user.organizationId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      organization: req.user.organizationId,
      assignedTo,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Tasks (by project)
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    const filter = {
      organization: req.user.organizationId,
    };

    if (projectId) {
      filter.project = projectId;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        organization: req.user.organizationId,
      },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organizationId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};