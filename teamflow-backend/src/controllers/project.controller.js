import Project from "../models/project.model.js"
import APIFeatures from "../utils/apiFeatures.js"
import { clearCacheByPattern } from "../utils/cache.js";

// Create Project
export const createProject = async(req, res) => {
    try {
        const project = await Project.create({
            ...req.body ,
            organization: req.user.organizationId
        })

        await project.save()

        //clear cache
        await clearCacheByPattern(
          `projects:${req.user.organizationId}:*`
        )
        
        res.status(201).json(project)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Get All Projects
export const getProjects = async (req, res) => {
  try {
    const baseFilter = {
      organization: req.user.organizationId,
    };

    const features = new APIFeatures(Project.find(), req.query)
      .filter(baseFilter)
      .search(["name", "description"])
      .sort()
      .paginate();

    const projects = await features.query;

    const total = await Project.countDocuments(
      features.query.getFilter()
    );

    res.json({
      success: true,
      page: features.page,
      limit: features.limit,
      total,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update a project
export const updateProject = async(req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                organization: req.user.organizationId
            },
            req.body,
            { new: true }
        )

        if(!project) {
            return res.status(404).json({ message: "Project Not Found"})
        }

        //clear cache
        await clearCacheByPattern(
          `projects:${req.user.organizationId}:*`
        )

        res.json(project)
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

//Delete Project
export const deleteProject = async(req, res) => {
    try {
        const project = await Project.findOneAndDelete(
            {
                _id: req.params.id,
                organization: req.user.organizationId
            }
        )

        if(!project) {
            return res.status(404).json({ message: "Project Not found to delete"})
        }

        //clear cache
        await clearCacheByPattern(
          `projects:${req.user.organizationId}:*`
        )

        res.json({ message: "Project Deleted"})
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}