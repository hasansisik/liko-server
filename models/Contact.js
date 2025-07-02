const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema({
  backgroundImage: { type: String, required: true },
  subtitle: { type: String, required: true },
  title: { type: String, required: true }
});

const SocialMediaSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  link: { type: String, required: true }
});

const FormSchema = new mongoose.Schema({
  nameLabel: { type: String, required: true },
  namePlaceholder: { type: String, required: true },
  subjectLabel: { type: String, required: true },
  subjectPlaceholder: { type: String, required: true },
  messageLabel: { type: String, required: true },
  messagePlaceholder: { type: String, required: true },
  buttonText: { type: String, required: true }
});

const ContactFormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  socialText: { type: String, required: true },
  socialMedia: [SocialMediaSchema],
  form: FormSchema
});

const LocationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  img: { type: String, required: true },
  country: { type: String, required: true },
  time: { type: String, required: true },
  locationTitle: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  mapsText: { type: String, required: true },
  mapsUrl: { type: String, required: true }
});

const ContactInfoSchema = new mongoose.Schema({
  locations: [LocationSchema]
});

const ContactSchema = new mongoose.Schema(
  {
    hero: HeroSchema,
    contactForm: ContactFormSchema,
    contactInfo: ContactInfoSchema,
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

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact; 