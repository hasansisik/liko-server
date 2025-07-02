const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  heroBanner: {
    videoSrc: {
      type: String,
      required: true,
      default: "/assets/img/home-01/video1.mp4"
    },
    desktopTitle: {
      type: String,
      required: true,
      default: "Route to a Perfect Smile"
    },
    mobileTitle: {
      type: String,
      required: true,
      default: "Excellence in Aesthetics & Health"
    },
    description: {
      type: String,
      required: true,
      default: "Rediscover your beauty with our Clinic's team of experts, personalized solutions, and the latest technology."
    }
  },
  serviceSection: {
    title: {
      type: String,
      required: true,
      default: "Dental"
    },
    subtitle: {
      type: String,
      required: true,
      default: "Excellence"
    },
    buttonText: {
      type: String,
      required: true,
      default: "See All Services"
    },
    buttonLink: {
      type: String,
      required: true,
      default: "/service"
    }
  },
  aboutSection: {
    mainTitle: {
      type: String,
      required: true,
      default: "Cooperation is possible within various shapes and formats"
    },
    items: [{
      id: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      imagePosition: {
        type: String,
        enum: ['left', 'right'],
        required: true
      }
    }]
  },
  teamSection: {
    spacing: {
      type: String,
      default: "pt-20"
    },
    teamMembers: [{
      id: {
        type: Number,
        required: true
      },
      img: {
        type: String,
        required: true
      }
    }]
  },
  videoSection: {
    videoSrc: {
      type: String,
      required: true,
      default: "/assets/img/home-01/video1.mp4"
    }
  },
  faqSection: {
    title: {
      type: String,
      required: true,
      default: "Frequently Asked Question"
    },
    description: {
      type: String,
      required: true,
      default: "We believe in making life-long connections through great communication."
    },
    shapeImage: {
      type: String,
      required: true,
      default: "/assets/img/home-02/service/sv-shape-1.png"
    },
    faqItems: [{
      id: {
        type: Number,
        required: true
      },
      question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      }
    }]
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

module.exports = mongoose.model('Home', HomeSchema); 