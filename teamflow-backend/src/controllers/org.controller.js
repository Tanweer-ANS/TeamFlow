import Organization from "../models/organization.model.js"
import Membership from "../models/membership.model.js"

export const createOrganization = async(req, res) => {
    try {
        const { name } = req.body

        const org = await Organization.create({
            name,
            owner: req.user.userId
        });

        //Create Membership
        const membership = await Membership.create({
            user: req.user.userId,
            organization: org._id,
            role: "ADMIN"
        })

        res.status(201).json({ org, membership})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Add Member
export const addMember = async(req, res) => {
    try {
        const { userId, role } = req.body

        const membership = await Membership.create({
            user: userId,
            organization: req.user.organizationId,
            role: role || "MEMBER"
        })
        res.json(membership)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Get Org Members
export const getMembers = async(req, res) => {
    try {
        const members = await Membership.find({
            organization: req.user.organizationId
        }).populate("user", "name emails")

        res.json(members)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

