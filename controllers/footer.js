const Footer = require("../models/Footer");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Default footer data
const defaultFooterData = {
  company: {
    logo: "/assets/img/logo/logo-white.png",
    logoDark: "/assets/img/logo/logo.png",
    description: "Drop us a line sed id semper risus in hend rerit1."
  },
  office: {
    title: "Office",
    address: {
      text: "740 NEW SOUTH HEAD RD, TRIPLE BAY SWFW 3108, NEW YORK",
      url: "https://www.google.com/maps/@23.8223596,90.3656686,15z?entry=ttu"
    },
    phone: {
      text: "P: + 725 214 456",
      number: "+725214456"
    },
    email: {
      text: "E: contact@liko.com",
      address: "contact@liko.com"
    }
  },
  sitemap: {
    title: "Sitemap",
    links: [
      { text: "Home", url: "/" },
      { text: "About", url: "/about-us" },
      { text: "Contact", url: "/contact" },
      { text: "Blog", url: "/blog" },
      { text: "Services", url: "/service" }
    ]
  },
  legal: {
    title: "Legal & Policies",
    links: [
      { text: "Privacy Policy", url: "/privacy-policy" },
      { text: "Terms of Service", url: "/terms-of-service" },
      { text: "Cookie Policy", url: "/cookie-policy" },
      { text: "HIPAA Privacy Notice", url: "/hipaa-privacy-notice" }
    ]
  },
  copyright: {
    text: "All rights reserved — {year} © Themepure",
    socialLinks: [
      { text: "Linkedin", url: "https://www.linkedin.com/company/birimajans" },
      { text: "Twitter", url: "https://twitter.com/birimajans" },
      { text: "Instagram", url: "https://www.instagram.com/birimajans" }
    ]
  }
};

// Get Footer Data (Public - no auth required)
const getFooter = async (req, res) => {
  try {
    // For public access, get the first active footer data or use companyId from query
    const companyId = req.query.companyId;
    
    let footer;
    if (companyId) {
      footer = await Footer.findOne({ 
        companyId: companyId,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active footer
      footer = await Footer.findOne({ 
        isActive: true 
      });
    }

    if (!footer) {
      // Create a default footer if none exists
      const defaultFooter = new Footer({
        ...defaultFooterData,
        companyId: companyId || "default",
        isActive: true
      });
      
      await defaultFooter.save();
      return res.status(StatusCodes.OK).json({ footer: defaultFooter });
    }
    
    res.status(StatusCodes.OK).json({ footer });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Footer verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Footer Data (Admin/Editor Only)
const createFooter = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { company, office, sitemap, legal, copyright } = req.body;

    // Mevcut aktif footer'ı pasif yap
    await Footer.updateMany(
      { isActive: true },
      { isActive: false }
    );

    const footer = new Footer({
      company,
      office,
      sitemap,
      legal,
      copyright,
      companyId: "default",
      isActive: true
    });

    await footer.save();

    res.status(StatusCodes.CREATED).json({
      message: "Footer verisi başarıyla oluşturuldu",
      footer
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Footer verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Footer Data (Admin/Editor Only)
const updateFooter = async (req, res) => {
  try {
    const { footerId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const footer = await Footer.findById(footerId);
    if (!footer) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Footer verisi bulunamadı" 
      });
    }

    // Allow editing regardless of company

    const { company, office, sitemap, legal, copyright } = req.body;

    if (company) footer.company = { ...footer.company, ...company };
    if (office) footer.office = { ...footer.office, ...office };
    if (sitemap) footer.sitemap = { ...footer.sitemap, ...sitemap };
    if (legal) footer.legal = { ...footer.legal, ...legal };
    if (copyright) footer.copyright = { ...footer.copyright, ...copyright };

    await footer.save();

    res.status(StatusCodes.OK).json({ 
      message: "Footer verisi güncellendi",
      footer
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Footer verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Footer Data (Admin Only)
const deleteFooter = async (req, res) => {
  try {
    const { footerId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const footer = await Footer.findById(footerId);
    if (!footer) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Footer verisi bulunamadı" 
      });
    }

    // Allow deleting regardless of company

    await Footer.findByIdAndDelete(footerId);

    res.status(StatusCodes.OK).json({ 
      message: "Footer verisi başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Footer verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All Footer Data (Admin Only)
const getAllFooter = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const footerList = await Footer.find({})
      .sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({ footerList });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Footer verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getFooter,
  createFooter,
  updateFooter,
  deleteFooter,
  getAllFooter
};
