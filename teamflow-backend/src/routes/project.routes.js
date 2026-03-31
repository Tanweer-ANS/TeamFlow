import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import orgMiddleware  from "../middleware/org.middleware.js"
import authorizeRoles from "../middleware/role.middleware.js"
import validate from "../middleware/validate.middleware.js"

import {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} from "../controllers/project.controller.js"

import {
    createProjectSchema,
    updateProjectSchema
} from "../validators/project.validator.js"

const router = express.Router()

//Create Project route
router.post("/", authMiddleware, orgMiddleware, validate(createProjectSchema), createProject)

//Get all Projects
router.get("/", authMiddleware, orgMiddleware, getProjects)

//update Project
router.put("/:id", authMiddleware, orgMiddleware, validate(updateProjectSchema), updateProject)

//Delete Project
router.delete("/:id", authMiddleware, orgMiddleware, authorizeRoles("ADMIN"), deleteProject)

export default router