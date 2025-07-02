const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema({
  backgroundImage: { type: String, required: true },
  subtitle: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  scrollText: { type: String, required: true }
});

const ServicesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  servicesList: {
    column1: [{ type: String }],
    column2: [{ type: String }]
  }
});

const AboutInfoSchema = new mongoose.Schema({
  welcomeText: { type: String, required: true },
  mainContent: { type: String, required: true },
  services: ServicesSchema
});

const AboutSchema = new mongoose.Schema(
  {
    hero: HeroSchema,
    aboutInfo: AboutInfoSchema,
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

const About = mongoose.model("About", AboutSchema);
module.exports = About; 