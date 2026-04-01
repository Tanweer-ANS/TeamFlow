import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import orgMiddleware from "../middleware/org.middleware.js";
import validate from "../middleware/validate.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js"

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator.js";

const router = express.Router();

// Create task
router.post(
  "/",
  authMiddleware,
  orgMiddleware,
  validate(createTaskSchema),
  createTask
);

// Get tasks
router.get("/", authMiddleware, orgMiddleware, getTasks);

// Update task
router.put(
  "/:id",
  authMiddleware,
  orgMiddleware,
  validate(updateTaskSchema),
  updateTask
);

// Delete task
router.delete("/:id", authMiddleware, orgMiddleware, authorizeRoles("ADMIN"), deleteTask);

export default router;