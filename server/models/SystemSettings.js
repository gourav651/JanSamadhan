import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    // ROLE & ACCESS CONTROL
    rolePermissions: {
      ADMIN: {
        read: { type: Boolean, default: true },
        write: { type: Boolean, default: true },
        analytics: { type: Boolean, default: true },
      },
      AUTHORITY: {
        read: { type: Boolean, default: true },
        write: { type: Boolean, default: true },
        analytics: { type: Boolean, default: false },
      },
      CITIZEN: {
        read: { type: Boolean, default: true },
        write: { type: Boolean, default: false },
        analytics: { type: Boolean, default: false },
      },
    },

    // NOTIFICATION SETTINGS (GLOBAL)
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      critical: { type: Boolean, default: true },
    },

    // SYSTEM PREFERENCES
    slaHours: { type: Number, default: 48 },
    escalationRule: {
      type: String,
      enum: ["24H", "48H", "72H"],
      default: "24H",
    },
    auditLogging: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SystemSettings", systemSettingsSchema);
