import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["STREET_LIGHT", "POTHOLE", "GARBAGE", "WATER", "ROAD", "OTHER"],
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
    },

    images: [
      {
        type: String, // Cloudinary URL later
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      address: String,
    },

    upvotes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        text: String,
        author: String,
        createdAt: Date,
      },
    ],

    reportedBy: {
      type: String, // Clerk userId later
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 Geo index (important for map & nearby issues)
issueSchema.index({ location: "2dsphere" });

export default mongoose.model("Issue", issueSchema);
