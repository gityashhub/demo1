import mongoose from "mongoose";

const projectShowcaseSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      maxlength: 1000
    },

    images: [
      {
        type: String 
      }
    ],

    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("ProjectShowcase", projectShowcaseSchema);
