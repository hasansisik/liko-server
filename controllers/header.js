const Header = require("../models/Header");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Default header data
const defaultHeaderData = {
  logo: {
    default: "/assets/img/logo/logo-white.png",
    dark: "/assets/img/logo/logo.png",
    sticky: "/assets/img/logo/logo.png",
    alt: "logo",
    dimensions: {
      default: { width: 150, height: 50 },
      sticky: { width: 120, height: 40 }
    }
  },
  navigation: {
    menus: [
      {
        id: 1,
        title: "Home",
        url: "/",
        hasDropdown: false
      },
      {
        id: 2,
        title: "About",
        url: "/about-us",
        hasDropdown: false
      },
      {
        id: 3,
        title: "Services",
        url: "/service",
        hasDropdown: true,
        subMenus: [
          { id: 31, title: "General Dentistry", url: "/service/general" },
          { id: 32, title: "Cosmetic Dentistry", url: "/service/cosmetic" },
          { id: 33, title: "Orthodontics", url: "/service/orthodontics" },
          { id: 34, title: "Oral Surgery", url: "/service/surgery" }
        ]
      },
      {
        id: 4,
        title: "Blog",
        url: "/blog",
        hasDropdown: false
      },
      {
        id: 5,
        title: "Contact",
        url: "/contact",
        hasDropdown: false
      }
    ],
    cta: {
      text: "Get Personal Advice",
      action: "openDialog"
    }
  },
  mobile: {
    hamburgerIcon: {
      lines: 2,
      animation: true
    },
    offcanvas: {
      logo: {
        src: "/assets/img/logo/logo.png",
        alt: "logo",
        width: 120,
        height: 40
      },
      information: {
        title: "Information",
        phone: {
          text: "+ 4 20 7700 1007",
          number: "+420777001007"
        },
        email: {
          text: "hello@diego.com",
          address: "hello@diego.com"
        },
        address: {
          text: "Avenue de Roma 158b, Lisboa",
          link: ""
        }
      },
      socialMedia: {
        title: "Follow Us",
        links: [
          {
            platform: "Instagram",
            url: "#",
            icon: "InstagramTwo"
          },
          {
            platform: "YouTube",
            url: "#", 
            icon: "Youtube"
          }
        ]
      }
    }
  },
  dialog: {
    enabled: true,
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      closeOnClick: true
    },
    closeButton: {
      text: "×",
      size: "24px",
      position: { top: "15px", right: "15px" }
    }
  },
  styling: {
    container: {
      padding: "0 clamp(20px, 6vw, 300px)",
      maxWidth: "100%"
    },
    header: {
      padding: "10px 0",
      transition: "background-color 0.3s ease",
      stickyBackground: "white",
      transparentBackground: "transparent",
      boxShadow: {
        default: "none",
        sticky: "0 2px 10px rgba(0,0,0,0.1)"
      }
    },
    colors: {
      hamburger: {
        default: "white",
        black: "#333",
        white: "white",
        sticky: "#333"
      }
    }
  }
};

// Get Header Data (Public - no auth required)
const getHeader = async (req, res) => {
  try {
    // For public access, get the first active header data or use companyId from query
    const companyId = req.query.companyId;
    
    let header;
    if (companyId) {
      header = await Header.findOne({ 
        companyId: companyId,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active header
      header = await Header.findOne({ 
        isActive: true 
      });
    }

    if (!header) {
      // Create a default header if none exists
      const defaultHeader = new Header({
        ...defaultHeaderData,
        companyId: companyId || "default",
        isActive: true
      });
      
      await defaultHeader.save();
      return res.status(StatusCodes.OK).json({ header: defaultHeader });
    }

    // Ensure existing headers have offcanvas structure for backwards compatibility
    if (!header.mobile.offcanvas) {
      header.mobile.offcanvas = {
        logo: {
          src: "/assets/img/logo/logo.png",
          alt: "logo",
          width: 120,
          height: 40
        },
        information: {
          title: "Information",
          phone: {
            text: "+ 4 20 7700 1007",
            number: "+420777001007"
          },
          email: {
            text: "hello@diego.com",
            address: "hello@diego.com"
          },
          address: {
            text: "Avenue de Roma 158b, Lisboa",
            link: ""
          }
        },
        socialMedia: {
          title: "Follow Us",
          links: [
            {
              platform: "Instagram",
              url: "#",
              icon: "InstagramTwo"
            },
            {
              platform: "YouTube",
              url: "#", 
              icon: "Youtube"
            }
          ]
        }
      };
      
      // Save the updated header with offcanvas structure
      await header.save();
    }
    
    res.status(StatusCodes.OK).json({ header });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Header verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Header Data (Admin/Editor Only)
const createHeader = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { logo, navigation, mobile, dialog, styling } = req.body;

    // Mevcut aktif header'ı pasif yap
    await Header.updateMany(
      { isActive: true },
      { isActive: false }
    );

    const header = new Header({
      logo,
      navigation,
      mobile,
      dialog,
      styling,
      companyId: "default",
      isActive: true
    });

    await header.save();

    res.status(StatusCodes.CREATED).json({
      message: "Header verisi başarıyla oluşturuldu",
      header
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Header verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Header Data (Admin/Editor Only)
const updateHeader = async (req, res) => {
  try {
    const { headerId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const header = await Header.findById(headerId);
    if (!header) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Header verisi bulunamadı" 
      });
    }

    // Allow editing regardless of company

    const { logo, navigation, mobile, dialog, styling } = req.body;

    // Deep merge function for nested objects
    const deepMerge = (target, source) => {
      const result = { ...target };
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    };

    // Ensure mobile.offcanvas exists before updating
    if (mobile && !header.mobile.offcanvas) {
      header.mobile.offcanvas = {
        logo: {
          src: "/assets/img/logo/logo.png",
          alt: "logo",
          width: 120,
          height: 40
        },
        information: {
          title: "Information",
          phone: {
            text: "+ 4 20 7700 1007",
            number: "+420777001007"
          },
          email: {
            text: "hello@diego.com",
            address: "hello@diego.com"
          },
          address: {
            text: "Avenue de Roma 158b, Lisboa",
            link: ""
          }
        },
        socialMedia: {
          title: "Follow Us",
          links: [
            {
              platform: "Instagram",
              url: "#",
              icon: "InstagramTwo"
            },
            {
              platform: "YouTube",
              url: "#", 
              icon: "Youtube"
            }
          ]
        }
      };
    }

    if (logo) header.logo = deepMerge(header.logo.toObject ? header.logo.toObject() : header.logo, logo);
    if (navigation) header.navigation = deepMerge(header.navigation.toObject ? header.navigation.toObject() : header.navigation, navigation);
    if (mobile) header.mobile = deepMerge(header.mobile.toObject ? header.mobile.toObject() : header.mobile, mobile);
    if (dialog) header.dialog = deepMerge(header.dialog.toObject ? header.dialog.toObject() : header.dialog, dialog);
    if (styling) header.styling = deepMerge(header.styling.toObject ? header.styling.toObject() : header.styling, styling);

    await header.save();

    res.status(StatusCodes.OK).json({ 
      message: "Header verisi güncellendi",
      header
    });
  } catch (error) {
    console.error('Header update error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Header verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Header Data (Admin Only)
const deleteHeader = async (req, res) => {
  try {
    const { headerId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const header = await Header.findById(headerId);
    if (!header) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Header verisi bulunamadı" 
      });
    }

    // Allow deleting regardless of company

    await Header.findByIdAndDelete(headerId);

    res.status(StatusCodes.OK).json({ 
      message: "Header verisi başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Header verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All Header Data (Admin Only)
const getAllHeader = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const headerList = await Header.find({})
      .sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({ headerList });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Header verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getHeader,
  createHeader,
  updateHeader,
  deleteHeader,
  getAllHeader
};
