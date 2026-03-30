import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import orgMiddleware from "../middleware/org.middleware.js"
import authorizeRoles from "../middleware/role.middleware.js"
import {
    createOrganization,
    addMember,
    removeMember,
    getMembers,
    getMyOrganizations,
    switchOrganization
} from "../controllers/org.controller.js"

const router = express.Router()

router.post("/", authMiddleware, createOrganization)

router.post("/add-member",
    authMiddleware,
    authorizeRoles("ADMIN"),
    addMember
)

router.delete(
    "/member/:userId",
    authMiddleware,
    orgMiddleware,
    authorizeRoles("ADMIN"),
    removeMember
);

router.get("/members",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getMembers
)

router.get("/my-orgs", authMiddleware, getMyOrganizations)

router.post("/switch", authMiddleware, switchOrganization);

export default router;