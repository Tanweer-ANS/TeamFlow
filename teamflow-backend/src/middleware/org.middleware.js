import Membership from "../models/Membership.js";

const orgMiddleware = async (req, res, next) => {
    try {
        const orgId = req.headers["x-org-id"]
        if(!orgId) {
            return res.status(400).json({ message: "Organization ID required"})
        }

        const membership = await Membership.findOne({
            user: req.user.userId,
            organization: orgId
        })

        if(!membership) {
            return res.status(403).json({ message: "Not part of this Organization"})
        }

        //attch org context
        req.user.organizationId = orgId
        req.user.role = membership.role

        next()
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}