const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get All Blog Posts (Public - no auth required)
const getAllBlogPosts = async (req, res) => {
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
    
    const blogPosts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Filter out non-approved comments for public view
    blogPosts.forEach(post => {
      if (post.comments) {
        post.comments = post.comments.filter(comment => comment.isApproved);
      }
    });
    
    const total = await BlogPost.countDocuments(filter);
    
    res.status(StatusCodes.OK).json({
      blogPosts,
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
      message: "An error occurred while fetching blog posts",
      error: error.message
    });
  }
};

// Get Single Blog Post (Public - no auth required)
const getBlogPost = async (req, res) => {
  try {
    const { id, slug } = req.params;
    
    let blogPost;
    if (id) {
      blogPost = await BlogPost.findById(id);
    } else if (slug) {
      blogPost = await BlogPost.findOne({ slug, isPublished: true });
    }
    
    if (!blogPost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Blog post bulunamadı"
      });
    }

    // Filter out non-approved comments for public view
    if (blogPost.comments) {
      blogPost.comments = blogPost.comments.filter(comment => comment.isApproved);
    }
    
    res.status(StatusCodes.OK).json({ blogPost });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog post alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Get Single Blog Post for Admin (shows all comments including pending)
const getBlogPostForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir"
      });
    }
    
    const blogPost = await BlogPost.findById(id);
    
    if (!blogPost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Blog post bulunamadı"
      });
    }
    
    // Return all comments (approved and pending) for admin
    res.status(StatusCodes.OK).json({ blogPost });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog post alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Blog Post (Admin/Editor Only)
const createBlogPost = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir"
      });
    }

    const blogPostData = {
      ...req.body,
      author: requestingUser.name || requestingUser.email
    };

    const blogPost = new BlogPost(blogPostData);
    await blogPost.save();

    res.status(StatusCodes.CREATED).json({
      message: "Blog post başarıyla oluşturuldu",
      blogPost
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bu slug ile zaten bir blog post mevcut"
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog post oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Blog Post (Admin/Editor Only)
const updateBlogPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir"
      });
    }

    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Blog post bulunamadı"
      });
    }

    // Allow editing all blog posts

    // Update blog post
    Object.assign(blogPost, req.body);
    await blogPost.save();

    res.status(StatusCodes.OK).json({
      message: "Blog post güncellendi",
      blogPost
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bu slug ile zaten bir blog post mevcut"
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog post güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Blog Post (Admin Only)
const deleteBlogPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin yapabilir"
      });
    }

    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Blog post bulunamadı"
      });
    }

    // Allow deleting all blog posts

    await BlogPost.findByIdAndDelete(postId);

    res.status(StatusCodes.OK).json({
      message: "Blog post başarıyla silindi"
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog post silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Add Comment to Blog Post (Public)
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { name, email, comment, avatar } = req.body;

    console.log('Add Comment Request:', { postId, name, email, comment: comment?.substring(0, 50) + '...' });

    if (!name || !email || !comment) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Name, email and comment fields are required"
      });
    }

    // Validate MongoDB ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid blog post ID format"
      });
    }

    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Blog post not found"
      });
    }

    const newComment = {
      name,
      email,
      comment,
      avatar: avatar || "/assets/img/inner-blog/blog-details/avatar/avatar-3.jpg",
      date: new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isApproved: false,
      isGuest: true
    };

    blogPost.comments.push(newComment);
    await blogPost.save();

    res.status(StatusCodes.CREATED).json({
      message: "Your comment has been submitted. It will appear after approval.",
      comment: newComment
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while adding the comment",
      error: error.message
    });
  }
};

// Get Blog Categories (Public)
const getCategories = async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category');
    res.status(StatusCodes.OK).json({ categories });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Kategoriler alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All Comments (Admin Only)
const getAllComments = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir"
      });
    }

    const { status, page, limit } = req.query;
    
    // Build aggregation pipeline
    const pipeline = [
      { $unwind: "$comments" },
      {
        $match: status === 'pending' ? { "comments.isApproved": false } 
                : status === 'approved' ? { "comments.isApproved": true }
                : {}
      },
      {
        $project: {
          postTitle: "$title",
          postId: "$_id",
          comment: "$comments",
          createdAt: "$createdAt"
        }
      },
      { $sort: { "comment.date": -1 } }
    ];

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const comments = await BlogPost.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limitNum }
    ]);

    const total = await BlogPost.aggregate([
      ...pipeline,
      { $count: "total" }
    ]);

    res.status(StatusCodes.OK).json({
      comments,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil((total[0]?.total || 0) / limitNum),
        totalComments: total[0]?.total || 0,
        hasNext: pageNum < Math.ceil((total[0]?.total || 0) / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Yorumlar alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Approve Comment (Admin Only)
const approveComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir"
      });
    }

    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Blog post bulunamadı"
      });
    }

    const comment = blogPost.comments.id(commentId);
    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Yorum bulunamadı"
      });
    }

    comment.isApproved = true;
    await blogPost.save();

    res.status(StatusCodes.OK).json({
      message: "Yorum onaylandı",
      comment
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Yorum onaylanırken bir hata oluştu",
      error: error.message
    });
  }
};

// Reject/Delete Comment (Admin Only)
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir"
      });
    }

    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Blog post bulunamadı"
      });
    }

    const commentIndex = blogPost.comments.findIndex(c => c._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Yorum bulunamadı"
      });
    }

    blogPost.comments.splice(commentIndex, 1);
    await blogPost.save();

    res.status(StatusCodes.OK).json({
      message: "Yorum silindi"
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Yorum silinirken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getAllBlogPosts,
  getBlogPost,
  getBlogPostForAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addComment,
  getAllComments,
  approveComment,
  deleteComment,
  getCategories
}; 
 
 
 
 