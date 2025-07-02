const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  logo: { type: String, required: true },
  logoDark: { type: String, required: true },
  description: { type: String, required: true }
});

const OfficeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  address: {
    text: { type: String, required: true },
    url: { type: String, required: true }
  },
  phone: {
    text: { type: String, required: true },
    number: { type: String, required: true }
  },
  email: {
    text: { type: String, required: true },
    address: { type: String, required: true }
  }
});

const LinkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  url: { type: String, required: true }
});

const SitemapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  links: [LinkSchema]
});

const LegalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  links: [LinkSchema]
});

const CopyrightSchema = new mongoose.Schema({
  text: { type: String, required: true }, // {year} will be replaced with current year
  socialLinks: [LinkSchema]
});

const FooterSchema = new mongoose.Schema(
  {
    company: CompanySchema,
    office: OfficeSchema,
    sitemap: SitemapSchema,
    legal: LegalSchema,
    copyright: CopyrightSchema,
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

const Footer = mongoose.model("Footer", FooterSchema);
module.exports = Footer; 