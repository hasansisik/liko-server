const About = require("../models/About");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get About Data (Public - no auth required)
const getAbout = async (req, res) => {
  try {
    // For public access, get the first active about data or use companyId from query
    const companyId = req.query.companyId;
    
    let about;
    if (companyId) {
      about = await About.findOne({ 
        companyId: companyId,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active about
      about = await About.findOne({ 
        isActive: true 
      });
    }

    if (!about) {
      // Create a default about if none exists
      const defaultAboutData = {
        hero: {
          backgroundImage: "/assets/img/home-01/hero/dentist-2.jpg",
          subtitle: "Professional dental care",
          title: "Creating Healthy Smiles",
          description: "Comprehensive dental care with personalized treatment approach",
          scrollText: "Scroll to explore"
        },
        aboutInfo: {
          welcomeText: "Welcome!",
          mainContent: "We are a modern dental clinic dedicated to providing exceptional oral healthcare services in a comfortable and caring environment. Our experienced team of dental professionals is committed to helping you achieve and maintain optimal oral health with the latest technology and personalized treatment plans.",
          services: {
            title: "Our",
            subtitle: "SERVICES",
            servicesList: {
              column1: [
                "General Dentistry",
                "Cosmetic Dentistry", 
                "Teeth Whitening",
                "Dental Implants",
                "Root Canal Treatment"
              ],
              column2: [
                "Orthodontics",
                "Periodontal Care",
                "Oral Surgery",
                "Preventive Care"
              ]
            }
          }
        }
      };

      const defaultAbout = new About({
        ...defaultAboutData,
        companyId: companyId || "default",
        isActive: true
      });
      
      await defaultAbout.save();
      return res.status(StatusCodes.OK).json({ about: defaultAbout });
    }
    
    res.status(StatusCodes.OK).json({ about });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "About verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create About Data (Admin Only)
const createAbout = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { hero, aboutInfo } = req.body;

    // Mevcut aktif about'u pasif yap
    await About.updateMany(
      { companyId: requestingUser.companyId, isActive: true },
      { isActive: false }
    );

    const about = new About({
      hero,
      aboutInfo,
      companyId: requestingUser.companyId,
      isActive: true
    });

    await about.save();

    res.status(StatusCodes.CREATED).json({
      message: "About verisi başarıyla oluşturuldu",
      about
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "About verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update About Data (Admin/Editor Only)
const updateAbout = async (req, res) => {
  try {
    const { aboutId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const about = await About.findById(aboutId);
    if (!about) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "About verisi bulunamadı" 
      });
    }

    // Check if about belongs to the same company
    if (about.companyId !== requestingUser.companyId) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Farklı şirket verilerini düzenleyemezsiniz" 
      });
    }

    const { hero, aboutInfo } = req.body;

    if (hero) about.hero = { ...about.hero, ...hero };
    if (aboutInfo) about.aboutInfo = { ...about.aboutInfo, ...aboutInfo };

    await about.save();

    res.status(StatusCodes.OK).json({ 
      message: "About verisi güncellendi",
      about
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "About verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete About Data (Admin Only)
const deleteAbout = async (req, res) => {
  try {
    const { aboutId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const about = await About.findById(aboutId);
    if (!about) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "About verisi bulunamadı" 
      });
    }

    // Check if about belongs to the same company
    if (about.companyId !== requestingUser.companyId) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Farklı şirket verilerini silemezsiniz" 
      });
    }

    await About.findByIdAndDelete(aboutId);

    res.status(StatusCodes.OK).json({ 
      message: "About verisi başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "About verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All About Data (Admin Only)
const getAllAbout = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const aboutList = await About.find({ companyId: requestingUser.companyId })
      .sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({ aboutList });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "About verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  getAllAbout
}; 