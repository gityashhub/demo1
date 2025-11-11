import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    pricingPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PricingPackage"
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    brief: {
      type: String,
      required: true,
      maxlength: 2000
    },

    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "in-progress",
        "submitted",
        "completed",
        "paid",
        "cancelled"
      ],
      default: "requested",
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
