const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  hero: {
    videoSrc: {
      type: String,
      required: true,
      default: "/assets/img/home-01/video1.mp4"
    },
    title: {
      type: String,
      required: true,
      default: "DENTAL INSIGHTS"
    },
    description: {
      type: String,
      required: true,
      default: "DISCOVER EXPERT TIPS, TREATMENT TRENDS, AND REAL STORIES TO HELP YOU MAKE INFORMED DECISIONS ABOUT YOUR SMILE."
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

module.exports = mongoose.model('Blog', BlogSchema); 