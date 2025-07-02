const mongoose = require("mongoose");

const FormSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "completed", "cancelled"],
      default: "new",
    },
    notes: {
      type: String,
      default: "",
    },
    companyId: {
      type: String,
      required: true,
      default: "default",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const FormSubmission = mongoose.model("FormSubmission", FormSubmissionSchema);
module.exports = FormSubmission; 