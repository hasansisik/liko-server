const ServicePost = require("../models/ServicePost");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get All Service Posts (Public - no auth required)
const getAllServicePosts = async (req, res) => {
  try {
    const { companyId, category, published, limit, page } = req.query;
    
    // Build filter
    let filter = {};
    if (companyId) {
      filter.companyId = companyId;
    }
    if (category) {
      filter.categories = { $in: [category] };
    }
    if (published !== undefined) {
      filter.isPublished = published === 'true';
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const servicePosts = await ServicePost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await ServicePost.countDocuments(filter);
    
    res.status(StatusCodes.OK).json({
      servicePosts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalPosts: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service postları alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Get Single Service Post (Public - no auth required)
const getServicePost = async (req, res) => {
  try {
    const { id, slug } = req.params;
    
    let servicePost;
    if (id) {
      servicePost = await ServicePost.findById(id);
    } else if (slug) {
      servicePost = await ServicePost.findOne({ slug, isPublished: true });
    }
    
    if (!servicePost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Service post bulunamadı"
      });
    }
    
    res.status(StatusCodes.OK).json({ servicePost });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service post alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Service Post (Admin/Editor Only)
const createServicePost = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir"
      });
    }

    const servicePostData = {
      ...req.body,
      author: requestingUser.name || requestingUser.email
    };

    const servicePost = new ServicePost(servicePostData);
    await servicePost.save();

    res.status(StatusCodes.CREATED).json({
      message: "Service post başarıyla oluşturuldu",
      servicePost
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bu slug ile zaten bir service post mevcut"
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service post oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Service Post (Admin/Editor Only)
const updateServicePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir"
      });
    }

    const servicePost = await ServicePost.findById(postId);
    if (!servicePost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Service post bulunamadı"
      });
    }

    // Allow editing all service posts

    // Update service post
    Object.assign(servicePost, req.body);
    await servicePost.save();

    res.status(StatusCodes.OK).json({
      message: "Service post güncellendi",
      servicePost
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bu slug ile zaten bir service post mevcut"
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service post güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Service Post (Admin Only)
const deleteServicePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin yapabilir"
      });
    }

    const servicePost = await ServicePost.findById(postId);
    if (!servicePost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Service post bulunamadı"
      });
    }

    // Allow deleting all service posts

    await ServicePost.findByIdAndDelete(postId);

    res.status(StatusCodes.OK).json({
      message: "Service post başarıyla silindi"
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service post silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Add Comment to Service Post (Public)
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { name, comment, avatar } = req.body;

    if (!name || !comment) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Ad ve yorum alanları zorunludur"
      });
    }

    const servicePost = await ServicePost.findById(postId);
    if (!servicePost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Service post bulunamadı"
      });
    }

    const newComment = {
      name,
      comment,
      avatar: avatar || "",
      date: new Date().toLocaleDateString('tr-TR')
    };

    servicePost.comments.push(newComment);
    servicePost.commentCount = servicePost.comments.length;
    
    await servicePost.save();

    res.status(StatusCodes.CREATED).json({
      message: "Yorum başarıyla eklendi",
      comment: newComment
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Yorum eklenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get Categories for Service Posts
const getCategories = async (req, res) => {
  try {
    // Get unique categories from all service posts
    const categories = await ServicePost.distinct('categories');
    
    // Count posts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const postCount = await ServicePost.countDocuments({ 
          categories: { $in: [category] },
          isPublished: true 
        });
        return {
          name: category,
          postCount
        };
      })
    );

    res.status(StatusCodes.OK).json({ 
      categories: categoriesWithCount 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Kategoriler alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getAllServicePosts,
  getServicePost,
  createServicePost,
  updateServicePost,
  deleteServicePost,
  addComment,
  getCategories
}; 
 
 
 
 