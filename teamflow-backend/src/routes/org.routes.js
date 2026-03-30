import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import authorizeRoles from "../middleware/role.middleware.js"
import {
    createOrganization,
    addMember,
    getMembers,
    getMyOrganizations
} from "../controllers/org.controller.js"

const router = express.Router()

router.post("/", authMiddleware, createOrganization)

router.post("/add-member",
    authMiddleware,
    authorizeRoles("ADMIN"),
    addMember
)

router.get( "/members",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getMembers
)

router.get("/my-orgs", authMiddleware, getMyOrganizations)

export default router;