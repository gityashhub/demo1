import mongoose from "mongoose";

const freelancerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true 
    },

    specialization: {
      type: String,
      required: true,
      trim: true
    },

    skills: {
      type: [String],
      required: true
    },

    experience: {
      type: Number,
      default: 0
    },

    description: {
      type: String,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

export default mongoose.model("FreelancerProfile", freelancerProfileSchema);
