const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      required: true,
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      default: "Admin",
    },
    videoId: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    blogQuote: {
      type: Boolean,
      default: false,
    },
    video: {
      type: Boolean,
      default: false,
    },
    imgSlider: {
      type: Boolean,
      default: false,
    },
    blogQuoteTwo: {
      type: Boolean,
      default: false,
    },
    blogHeroSlider: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      required: true,
    },
    content: {
      htmlContent: {
        type: String,
        required: true,
      },
    },
    comments: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
          default: "",
        },
        date: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        isApproved: {
          type: Boolean,
          default: false,
        },
        isGuest: {
          type: Boolean,
          default: true,
        },
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
    companyId: {
      type: String,
      default: "default",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual field for date
BlogPostSchema.virtual('date').get(function() {
  return this.createdAt;
});

// Ensure virtual fields are serialized
BlogPostSchema.set('toJSON', { virtuals: true });

// Turkish character conversion for slug
const turkishCharMap = {
  'ğ': 'g', 'Ğ': 'G',
  'ü': 'u', 'Ü': 'U', 
  'ş': 's', 'Ş': 'S',
  'ı': 'i', 'I': 'I',
  'ö': 'o', 'Ö': 'O',
  'ç': 'c', 'Ç': 'C'
};

function convertTurkishChars(text) {
  return text.replace(/[ğĞüÜşŞıIöÖçÇ]/g, function(match) {
    return turkishCharMap[match] || match;
  });
}

// Generate slug from title before saving
BlogPostSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title')) {
    let baseSlug = convertTurkishChars(this.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    this.slug = baseSlug;
  }
  
  // Update comment count (only approved comments)
  this.commentCount = this.comments ? this.comments.filter(comment => comment.isApproved).length : 0;
  
  next();
});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
module.exports = BlogPost; 