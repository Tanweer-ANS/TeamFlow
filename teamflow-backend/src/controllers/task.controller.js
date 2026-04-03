import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import APIFeatures from "../utils/apiFeatures.js";
import { getCache, setCache } from "../utils/cache.js";
import { clearCacheByPattern } from "../utils/cache.js";

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

    //clear cache
    await clearCacheByPattern(
      `tasks:${req.user.organizationId}:*`
    )


    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Tasks (by project)  [Added Advanced Filtering, Searching, Sorting, Pagination]
export const getTasks = async (req, res) => {
  try {
    const cacheKey = `tasks:${req.user.organizationId}:${JSON.stringify(req.query)}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      return res.json({
        source: "cache",
        ...cached,
      });
    }

    const baseFilter = {
      organization: req.user.organizationId,
    };

    const features = new APIFeatures(Task.find(), req.query)
      .filter(baseFilter)
      .search(["title"])
      .sort()
      .paginate();

    const tasks = await features.query.populate(
      "assignedTo",
      "name email"
    );

   const total = await Task.countDocuments(features.query.getFilter());

    // res.json({
    //   success: true,
    //   page: features.page,
    //   limit: features.limit,
    //   total,
    //   data: tasks,
    // });

    // Set cache for 1 minute
    const response = {
      total,
      page: features.page,
      limit: features.limit,
      data: tasks,
    }

    await setCache(cacheKey, response, 60);

    res.json({
      source: "db",
      ...response,
    });
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

     //clear cache
    await clearCacheByPattern(
      `tasks:${req.user.organizationId}:*`
    )


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

     //clear cache
    await clearCacheByPattern(
      `tasks:${req.user.organizationId}:*`
    )


    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};