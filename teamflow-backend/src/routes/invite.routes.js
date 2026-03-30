import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import orgMiddleware from "../middleware/org.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

import {
  sendInvite,
  acceptInvite,
} from "../controllers/invite.controller.js";

const router = express.Router();

// ADMIN sends invite
router.post(
  "/",
  authMiddleware,
  orgMiddleware,
  authorizeRoles("ADMIN"),
  sendInvite
);

// user accepts invite
router.post(
  "/:token/accept",
  authMiddleware,
  acceptInvite
);

export default router;