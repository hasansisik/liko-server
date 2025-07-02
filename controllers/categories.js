const Category = require("../models/Category");
const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get all categories (Public)
const getCategories = async (req, res) => {
  try {
    const companyId = req.query.companyId || "default";
    
    const categories = await Category.find({ 
      companyId: companyId,
      isActive: true 
    }).sort({ name: 1 });
    
    res.status(StatusCodes.OK).json({ categories });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Kategoriler alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Get single category (Public)
const getCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Kategori bulunamadı" 
      });
    }
    
    res.status(StatusCodes.OK).json({ category });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Kategori alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create category (Admin/Editor Only)
const createCategory = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { name, description, color, icon } = req.body;

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ 
      name: name.trim()
    });

    if (existingCategory) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        message: "Bu isimde bir kategori zaten mevcut" 
      });
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim() || "",
      color: color || "#3B82F6",
      icon: icon || ""
    });

    await category.save();

    res.status(StatusCodes.CREATED).json({
      message: "Kategori başarıyla oluşturuldu",
      category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        message: "Bu slug zaten kullanımda" 
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Kategori oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update category (Admin/Editor Only)
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Kategori bulunamadı" 
      });
    }

    // Allow editing all categories

    const { name, description, color, icon, isActive } = req.body;

    // Check if another category with same name exists (excluding current one)
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: name.trim(),
        _id: { $ne: categoryId }
      });

      if (existingCategory) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
          message: "Bu isimde bir kategori zaten mevcut" 
        });
      }
    }

    // Update fields
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (color) category.color = color;
    if (icon !== undefined) category.icon = icon;
    if (typeof isActive === 'boolean') category.isActive = isActive;

    await category.save();

    res.status(StatusCodes.OK).json({ 
      message: "Kategori güncellendi",
      category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        message: "Bu slug zaten kullanımda" 
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Kategori güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete category (Admin Only)
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Kategori bulunamadı" 
      });
    }

    // Allow deleting all categories

    // Check if category is being used by any blog posts
    const blogPostCount = await BlogPost.countDocuments({ 
      category: category.name
    });

    if (blogPostCount > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `Bu kategori ${blogPostCount} blog yazısında kullanılıyor. Önce bu yazıları başka kategoriye taşıyın.` 
      });
    }

    await Category.findByIdAndDelete(categoryId);

    res.status(StatusCodes.OK).json({ 
      message: "Kategori başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Kategori silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get all categories for admin (Admin Only)
const getAllCategories = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const categories = await Category.find({}).sort({ createdAt: -1 });

    // Update post counts for each category
    for (let category of categories) {
      const postCount = await BlogPost.countDocuments({ 
        categories: { $in: [category.name] }
      });
      
      if (category.postCount !== postCount) {
        category.postCount = postCount;
        await category.save();
      }
    }
    
    res.status(StatusCodes.OK).json({ categories });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Kategoriler alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
}; 
 
 
 
 