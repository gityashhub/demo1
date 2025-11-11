import mongoose from "mongoose";

const pricingPackageSchema = new mongoose.Schema(
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

    price: {
      type: Number,
      required: true,
      min: 0
    },

    deliveryDays: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("PricingPackage", pricingPackageSchema);
