const Service = require("../models/Service");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get Service Data (Public - no auth required)
const getService = async (req, res) => {
  try {
    // For public access, get the first active service data or use companyId from query
    const companyId = req.query.companyId;
    
    let service;
    if (companyId) {
      service = await Service.findOne({ 
        companyId: companyId,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active service
      service = await Service.findOne({ 
        isActive: true 
      });
    }

    if (!service) {
      // Return default data if no service found
      const defaultService = {
        hero: {
          title: "Expert Dental Care Services",
          description: "Transform your smile with our comprehensive dental treatments and modern technology.",
          image: "/assets/img/inner-service/hero/hero-1.jpg"
        },
        serviceSection: {
          subtitle: "Services",
          title: "We provide comprehensive dental care with modern technology and personalized treatment plans."
        },
        bigText: {
          leftText: "CLINIC",
          rightText: "TOUCH",
          mainText: "Get Contact",
          linkUrl: "/contact"
        }
      };

      return res.status(StatusCodes.OK).json({ service: defaultService });
    }
    
    res.status(StatusCodes.OK).json({ service });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Service verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Service Data (Admin/Editor Only)
const createService = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { hero, serviceSection, bigText } = req.body;

    // Mevcut aktif service'i pasif yap
    await Service.updateMany(
      { companyId: requestingUser.companyId, isActive: true },
      { isActive: false }
    );

    const service = new Service({
      hero,
      serviceSection,
      bigText,
      companyId: requestingUser.companyId,
      isActive: true
    });

    await service.save();

    res.status(StatusCodes.CREATED).json({
      message: "Service verisi başarıyla oluşturuldu",
      service
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Service Data (Admin/Editor Only)
const updateService = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { hero, serviceSection, bigText } = req.body;

    // Mevcut aktif service'i bul
    let service = await Service.findOne({ 
      companyId: requestingUser.companyId,
      isActive: true 
    });

    if (!service) {
      // Eğer service yoksa yeni oluştur
      service = new Service({
        hero,
        serviceSection,
        bigText,
        companyId: requestingUser.companyId,
        isActive: true
      });
    } else {
      // Mevcut service'i güncelle
      if (hero) service.hero = { ...service.hero, ...hero };
      if (serviceSection) service.serviceSection = { ...service.serviceSection, ...serviceSection };
      if (bigText) service.bigText = { ...service.bigText, ...bigText };
    }

    await service.save();

    res.status(StatusCodes.OK).json({ 
      message: "Service verisi güncellendi",
      service
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Service Data (Admin Only)
const deleteService = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const service = await Service.findOne({ 
      companyId: requestingUser.companyId,
      isActive: true 
    });
    
    if (!service) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Service verisi bulunamadı" 
      });
    }

    await Service.findByIdAndDelete(service._id);

    res.status(StatusCodes.OK).json({ 
      message: "Service verisi başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All Service Data (Admin Only)
const getAllService = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const services = await Service.find({ 
      companyId: requestingUser.companyId 
    }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ 
      services,
      count: services.length
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Service verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getService,
  createService,
  updateService,
  deleteService,
  getAllService
}; 