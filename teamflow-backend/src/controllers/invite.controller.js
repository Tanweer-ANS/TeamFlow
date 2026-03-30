import Invite from "../models/invite.model.js";
import Membership from "../models/membership.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer.js";

export const sendInvite = async (req, res) => {
  try {
    const { email, role } = req.body;

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await Invite.create({
      email,
      organization: req.user.organizationId,
      role,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    });

    const inviteLink = `${process.env.CLIENT_URL}/invite/${token}`;

    await sendEmail(
      email,
      "You're invited!",
      `
        <h2>Invitation to join organization</h2>
        <p>You have been invited to join an organization.</p>
        <a href="${inviteLink}">Accept Invite</a>
      `
    );

    res.json({ message: "Invite sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({ token });

    if (!invite || invite.status !== "PENDING") {
      return res.status(400).json({ message: "Invalid invite" });
    }

    // Expiry check
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite expired" });
    }

    // Email match (security)
    if (invite.email !== req.user.email) {
      return res.status(403).json({
        message: "This invite is not for your email",
      });
    }

    // create membership
    await Membership.create({
      user: req.user.userId,
      organization: invite.organization,
      role: invite.role,
    });

    invite.status = "ACCEPTED";
    await invite.save();

    res.json({ message: "Joined organization" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};