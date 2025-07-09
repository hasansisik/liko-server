const mongoose = require("mongoose");

const SEOSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: [
        'home',
        'about',
        'services',
        'blog',
        'contact',
        'portfolio',
        'team',
        'faq',
        'pricing',
        'privacy-policy',
        'terms-of-service',
        'cookie-policy'
      ]
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    keywords: {
      type: [String],
      default: []
    },
    ogTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    ogDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    ogImage: {
      type: String,
      trim: true
    },
    ogUrl: {
      type: String,
      trim: true
    },
    twitterTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    twitterDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    twitterImage: {
      type: String,
      trim: true
    },
    canonical: {
      type: String,
      trim: true
    },
    robots: {
      type: String,
      default: 'index, follow',
      enum: ['index, follow', 'noindex, nofollow', 'index, nofollow', 'noindex, follow']
    },
    structuredData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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

// Index for better performance
SEOSchema.index({ pageName: 1, companyId: 1 });

const SEO = mongoose.model("SEO", SEOSchema);
module.exports = SEO; 