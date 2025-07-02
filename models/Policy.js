const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ["privacy-policy", "terms-of-service", "cookie-policy"]
    },
    htmlContent: {
      type: String,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    companyId: {
      type: String,
      required: true,
      default: "default"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Policy = mongoose.model("Policy", PolicySchema);
module.exports = Policy; 