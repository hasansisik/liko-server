const SEO = require("../models/SEO");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get all SEO data
const getAllSEO = async (req, res) => {
  try {
    const requestingUser = req.user;
    
    const seoData = await SEO.find({ companyId: requestingUser.companyId })
      .sort({ pageName: 1 });
    
    res.status(StatusCodes.OK).json({ seoData });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SEO verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Get SEO data by page name
const getSEOByPage = async (req, res) => {
  try {
    const { pageName } = req.params;
    const requestingUser = req.user;
    
    const seoData = await SEO.findOne({ 
      pageName, 
      companyId: requestingUser.companyId 
    });
    
    if (!seoData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Bu sayfa için SEO verisi bulunamadı"
      });
    }
    
    res.status(StatusCodes.OK).json({ seoData });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SEO verisi alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create SEO data
const createSEO = async (req, res) => {
  try {
    const requestingUser = req.user;
    
    // Check if user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin yapabilir"
      });
    }

    const {
      pageName,
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonical,
      robots,
      structuredData,
      isActive
    } = req.body;

    // Check if SEO data already exists for this page
    const existingSEO = await SEO.findOne({ 
      pageName, 
      companyId: requestingUser.companyId 
    });
    
    if (existingSEO) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bu sayfa için SEO verisi zaten mevcut"
      });
    }

    const seoData = new SEO({
      pageName,
      title,
      description,
      keywords: keywords || [],
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || description,
      ogImage,
      ogUrl,
      twitterTitle: twitterTitle || title,
      twitterDescription: twitterDescription || description,
      twitterImage: twitterImage || ogImage,
      canonical,
      robots: robots || 'index, follow',
      structuredData: structuredData || {},
      companyId: requestingUser.companyId,
      isActive: isActive !== undefined ? isActive : true
    });

    await seoData.save();

    res.status(StatusCodes.CREATED).json({
      message: "SEO verisi başarıyla oluşturuldu",
      seoData
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bu sayfa için SEO verisi zaten mevcut"
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SEO verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update SEO data
const updateSEO = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUser = req.user;
    
    // Check if user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin yapabilir"
      });
    }

    const seoData = await SEO.findOne({ 
      _id: id, 
      companyId: requestingUser.companyId 
    });
    
    if (!seoData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "SEO verisi bulunamadı"
      });
    }

    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonical,
      robots,
      structuredData,
      isActive
    } = req.body;

    // Update fields
    if (title) seoData.title = title;
    if (description) seoData.description = description;
    if (keywords !== undefined) seoData.keywords = keywords;
    if (ogTitle !== undefined) seoData.ogTitle = ogTitle;
    if (ogDescription !== undefined) seoData.ogDescription = ogDescription;
    if (ogImage !== undefined) seoData.ogImage = ogImage;
    if (ogUrl !== undefined) seoData.ogUrl = ogUrl;
    if (twitterTitle !== undefined) seoData.twitterTitle = twitterTitle;
    if (twitterDescription !== undefined) seoData.twitterDescription = twitterDescription;
    if (twitterImage !== undefined) seoData.twitterImage = twitterImage;
    if (canonical !== undefined) seoData.canonical = canonical;
    if (robots !== undefined) seoData.robots = robots;
    if (structuredData !== undefined) seoData.structuredData = structuredData;
    if (isActive !== undefined) seoData.isActive = isActive;

    await seoData.save();

    res.status(StatusCodes.OK).json({
      message: "SEO verisi başarıyla güncellendi",
      seoData
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SEO verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete SEO data
const deleteSEO = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUser = req.user;
    
    // Check if user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin yapabilir"
      });
    }

    const seoData = await SEO.findOne({ 
      _id: id, 
      companyId: requestingUser.companyId 
    });
    
    if (!seoData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "SEO verisi bulunamadı"
      });
    }

    await SEO.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({
      message: "SEO verisi başarıyla silindi"
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SEO verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get public SEO data (for frontend)
const getPublicSEO = async (req, res) => {
  try {
    const { pageName } = req.params;
    const { companyId = 'default' } = req.query;
    
    const seoData = await SEO.findOne({ 
      pageName, 
      companyId,
      isActive: true 
    });
    
    if (!seoData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Bu sayfa için SEO verisi bulunamadı"
      });
    }
    
    res.status(StatusCodes.OK).json({ seoData });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SEO verisi alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getAllSEO,
  getSEOByPage,
  createSEO,
  updateSEO,
  deleteSEO,
  getPublicSEO
}; 