const mongoose = require("mongoose");

// Helper function to generate slug from Turkish text
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    color: {
      type: String,
      default: "#3B82F6" // Default blue color
    },
    icon: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    companyId: {
      type: String,
      required: false,
      default: "default"
    },
    postCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true 
  }
);

// Pre-save middleware to generate slug
CategorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = generateSlug(this.name);
  }
  next();
});

// Update slug when name is updated
CategorySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = generateSlug(update.name);
  }
  next();
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category; 
 
 
 
 