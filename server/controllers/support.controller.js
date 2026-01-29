import SupportTicket from "../models/SupportTicket.js";
import User from "../models/User.js";

/**
 * POST /api/support/tickets
 * Authority raises ticket
 */
export const createSupportTicket = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { title, description, priority } = req.body;

    const user = await User.findOne({
      clerkUserId,
      role: "AUTHORITY",
    });

    if (!user) {
      return res.status(403).json({ success: false });
    }

    const ticket = await SupportTicket.create({
      title,
      description,
      priority,
      raisedBy: user._id,
    });

    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/**
 * GET /api/admin/support/tickets
 * Admin views all tickets
 */
export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("raisedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/**
 * PATCH /api/admin/support/tickets/:id/status
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false });
    }

    ticket.status = status;
    await ticket.save();

    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
