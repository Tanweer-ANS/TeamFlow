import Project from "../models/project.model.js"

// Create Project
export const createProject = async(req, res) => {
    try {
        const project = await Project.create({
            ...req.body ,
            organization: req.user.organizationId
        })

        await project.save()
        
        res.status(201).json(project)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Get All Projects
export const getProjects = async(req, res) => {
    try {
        const projects = await Project.find({
            organization: req.user.organizationId
        }).sort({ createdAt: -1 })

        res.json(projects)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

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

        res.json({ message: "Project Deleted"})
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}