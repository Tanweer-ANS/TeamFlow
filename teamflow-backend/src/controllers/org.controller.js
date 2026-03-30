import Organization from "../models/organization.model.js"
import Membership from "../models/membership.model.js"
import jwt from "jsonwebtoken"

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

//Remove Member
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const orgId = req.user.organizationId;

    const org = await Organization.findById(orgId);

    // Prevent removing owner
    if (org.owner.toString() === userId) {
      return res.status(400).json({
        message: "Cannot remove organization owner",
      });
    }

    // Prevent removing yourself (optional)
    if (req.user.userId === userId) {
      return res.status(400).json({
        message: "You cannot remove yourself",
      });
    }

    const membership = await Membership.findOneAndDelete({
      user: userId,
      organization: orgId,
    });

    if (!membership) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

//Get my Orgs
export const getMyOrganizations = async(req, res) => {
    try {
        const memberships = await Membership.find({
            user:req.user.userId
        }).populate("organization", "name")
        res.json(memberships)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Switch Organization
export const switchOrganization = async (req, res) => {
  try {
    const { orgId } = req.body;

    const membership = await Membership.findOne({
      user: req.user.userId,
      organization: orgId,
    });

    if (!membership) {
      return res.status(403).json({ message: "Not part of org" });
    }

    const newToken = jwt.sign(
      {
        userId: req.user.userId,
        organizationId: orgId,
        role: membership.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};