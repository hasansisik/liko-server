const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: "Expert Dental Care Services"
    },
    description: {
      type: String,
      required: true,
      default: "Transform your smile with our comprehensive dental treatments and modern technology."
    },
    image: {
      type: String,
      required: true,
      default: "/assets/img/inner-service/hero/hero-1.jpg"
    }
  },
  serviceSection: {
    subtitle: {
      type: String,
      required: true,
      default: "Services"
    },
    title: {
      type: String,
      required: true,
      default: "We provide comprehensive dental care with modern technology and personalized treatment plans."
    }
  },
  bigText: {
    leftText: {
      type: String,
      required: true,
      default: "CLINIC"
    },
    rightText: {
      type: String,
      required: true,
      default: "TOUCH"
    },
    mainText: {
      type: String,
      required: true,
      default: "Get Contact"
    },
    linkUrl: {
      type: String,
      required: true,
      default: "/contact"
    }
  },
  companyId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema); 