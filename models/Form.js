const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  flag: { type: String, required: true },
  phone: { type: String, required: true }
});

const PlaceholdersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  countrySearch: { type: String, required: true }
});

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    responseTime: { type: String, required: true },
    showWhatsApp: { type: Boolean, default: true },
    whatsAppText: { type: String, required: true },
    whatsAppLink: { type: String, required: true },
    submitButtonText: { type: String, required: true },
    placeholders: PlaceholdersSchema,
    defaultCountry: { type: String, required: true },
    countries: [CountrySchema],
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

const Form = mongoose.model("Form", FormSchema);
module.exports = Form; 
 