const Blog = require("../models/Blog");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get Blog Data (Public - no auth required)
const getBlog = async (req, res) => {
  try {
    // For public access, get the first active blog data or use companyId from query
    const companyId = req.query.companyId;
    
    let blog;
    if (companyId) {
      blog = await Blog.findOne({ 
        companyId: companyId,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active blog
      blog = await Blog.findOne({ 
        isActive: true 
      });
    }

    if (!blog) {
      // Return default data if no blog found
      const defaultBlog = {
        hero: {
          videoSrc: "/assets/img/home-01/video1.mp4",
          title: "DENTAL INSIGHTS",
          description: "DISCOVER EXPERT TIPS, TREATMENT TRENDS, AND REAL STORIES TO HELP YOU MAKE INFORMED DECISIONS ABOUT YOUR SMILE."
        },
        bigText: {
          leftText: "CLINIC",
          rightText: "TOUCH",
          mainText: "Get Contact",
          linkUrl: "/contact"
        }
      };

      return res.status(StatusCodes.OK).json({ blog: defaultBlog });
    }
    
    res.status(StatusCodes.OK).json({ blog });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Blog verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Blog Data (Admin/Editor Only)
const createBlog = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { hero, bigText } = req.body;

    // Mevcut aktif blog'u pasif yap
    await Blog.updateMany(
      { companyId: requestingUser.companyId, isActive: true },
      { isActive: false }
    );

    const blog = new Blog({
      hero,
      bigText,
      companyId: requestingUser.companyId,
      isActive: true
    });

    await blog.save();

    res.status(StatusCodes.CREATED).json({
      message: "Blog verisi başarıyla oluşturuldu",
      blog
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Blog Data (Admin/Editor Only)
const updateBlog = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { hero, bigText } = req.body;

    // Mevcut aktif blog'u bul
    let blog = await Blog.findOne({ 
      companyId: requestingUser.companyId,
      isActive: true 
    });

    if (!blog) {
      // Eğer blog yoksa yeni oluştur
      blog = new Blog({
        hero,
        bigText,
        companyId: requestingUser.companyId,
        isActive: true
      });
    } else {
      // Mevcut blog'u güncelle
      if (hero) blog.hero = { ...blog.hero, ...hero };
      if (bigText) blog.bigText = { ...blog.bigText, ...bigText };
    }

    await blog.save();

    res.status(StatusCodes.OK).json({ 
      message: "Blog verisi güncellendi",
      blog
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Blog Data (Admin Only)
const deleteBlog = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const blog = await Blog.findOne({ 
      companyId: requestingUser.companyId,
      isActive: true 
    });
    
    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Blog verisi bulunamadı" 
      });
    }

    await Blog.findByIdAndDelete(blog._id);

    res.status(StatusCodes.OK).json({ 
      message: "Blog verisi başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All Blog Data (Admin Only)
const getAllBlog = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const blogs = await Blog.find({ 
      companyId: requestingUser.companyId 
    }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ 
      blogs,
      count: blogs.length
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Blog verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlog
}; 