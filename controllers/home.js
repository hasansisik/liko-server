const Home = require("../models/Home");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Default home data
const defaultHomeData = {
  heroBanner: {
    videoSrc: "/assets/img/home-01/video1.mp4",
    desktopTitle: "Route to a Perfect Smile",
    mobileTitle: "Excellence in Aesthetics & Health",
    description: "Rediscover your beauty with our Clinic's team of experts, personalized solutions, and the latest technology."
  },
  serviceSection: {
    title: "Dental",
    subtitle: "Excellence",
    buttonText: "See All Services",
    buttonLink: "/service"
  },
  aboutSection: {
    mainTitle: "Cooperation is possible within various shapes and formats",
    items: [
      {
        id: 1,
        image: "/assets/img/home-01/ab-1.jpg",
        title: "FOLLOW FOR THE BEST EYEWEAR INSPIRATION",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        imagePosition: 'left'
      },
      {
        id: 2,
        image: "/assets/img/home-01/ab-2.jpg",
        title: "FOLLOW FOR THE BEST EYEWEAR INSPIRATION",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        imagePosition: 'right'
      },
      {
        id: 3,
        image: "/assets/img/home-01/ab-3.jpg",
        title: "FOLLOW FOR THE BEST EYEWEAR INSPIRATION",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        imagePosition: 'left'
      },
      {
        id: 4,
        image: "/assets/img/home-01/ab-4.jpg",
        title: "FOLLOW FOR THE BEST EYEWEAR INSPIRATION",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        imagePosition: 'right'
      }
    ]
  },
  teamSection: {
    spacing: "pt-20",
    teamMembers: [
      { id: 1, img: "/assets/img/home-01/team/team-1-1.jpg" },
      { id: 2, img: "/assets/img/home-01/team/team-1-2.jpg" },
      { id: 3, img: "/assets/img/home-01/team/team-1-3.jpg" },
      { id: 4, img: "/assets/img/home-01/team/team-1-4.jpg" },
      { id: 5, img: "/assets/img/home-01/team/team-1-6.jpg" },
      { id: 6, img: "/assets/img/home-01/team/team-1-7.jpg" }
    ]
  },
  videoSection: {
    videoSrc: "/assets/img/home-01/video1.mp4"
  },
  faqSection: {
    title: "Frequently Asked Question",
    description: "We believe in making life-long connections through great communication.",
    shapeImage: "/assets/img/home-02/service/sv-shape-1.png",
    faqItems: [
      {
        id: 1,
        question: "What we do?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do. eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.!"
      },
      {
        id: 2,
        question: "How we do it?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do. eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.!"
      },
      {
        id: 3,
        question: "How can i download the products?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do. eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.!"
      },
      {
        id: 4,
        question: "Free Shipping & Return Order",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do. eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.!"
      },
      {
        id: 5,
        question: "Payment options",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do. eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.!"
      },
      {
        id: 6,
        question: "Best Quality Products",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do. eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.!"
      }
    ]
  }
};

// Get Home Data (Public - no auth required)
const getHome = async (req, res) => {
  try {
    // For public access, get the first active home data or use companyId from query
    const companyId = req.query.companyId;
    
    let home;
    if (companyId) {
      home = await Home.findOne({ 
        companyId: companyId,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active home
      home = await Home.findOne({ 
        isActive: true 
      });
    }

    if (!home) {
      // Return default data if no home found
      return res.status(StatusCodes.OK).json({ home: defaultHomeData });
    }
    
    res.status(StatusCodes.OK).json({ home });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Home verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Home Data (Admin/Editor Only)
const createHome = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { heroBanner, serviceSection, aboutSection, teamSection, videoSection, faqSection } = req.body;

    // Mevcut aktif home'u pasif yap
    await Home.updateMany(
      { companyId: requestingUser.companyId, isActive: true },
      { isActive: false }
    );

    const home = new Home({
      heroBanner,
      serviceSection,
      aboutSection,
      teamSection,
      videoSection,
      faqSection,
      companyId: requestingUser.companyId,
      isActive: true
    });

    await home.save();

    res.status(StatusCodes.CREATED).json({
      message: "Home verisi başarıyla oluşturuldu",
      home
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Home verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Home Data (Admin/Editor Only)
const updateHome = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { heroBanner, serviceSection, aboutSection, teamSection, videoSection, faqSection } = req.body;

    // Mevcut aktif home'u bul
    let home = await Home.findOne({ 
      companyId: requestingUser.companyId,
      isActive: true 
    });

    if (!home) {
      // Eğer home yoksa yeni oluştur
      home = new Home({
        heroBanner,
        serviceSection,
        aboutSection,
        teamSection,
        videoSection,
        faqSection,
        companyId: requestingUser.companyId,
        isActive: true
      });
    } else {
      // Mevcut home'u güncelle
      if (heroBanner) home.heroBanner = { ...home.heroBanner, ...heroBanner };
      if (serviceSection) home.serviceSection = { ...home.serviceSection, ...serviceSection };
      if (aboutSection) home.aboutSection = { ...home.aboutSection, ...aboutSection };
      if (teamSection) home.teamSection = { ...home.teamSection, ...teamSection };
      if (videoSection) home.videoSection = { ...home.videoSection, ...videoSection };
      if (faqSection) home.faqSection = { ...home.faqSection, ...faqSection };
    }

    await home.save();

    res.status(StatusCodes.OK).json({ 
      message: "Home verisi güncellendi",
      home
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Home verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Home Data (Admin Only)
const deleteHome = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const home = await Home.findOne({ 
      companyId: requestingUser.companyId,
      isActive: true 
    });
    
    if (!home) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Home verisi bulunamadı" 
      });
    }

    await Home.findByIdAndDelete(home._id);

    res.status(StatusCodes.OK).json({ 
      message: "Home verisi başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Home verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All Home Data (Admin Only)
const getAllHome = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const homes = await Home.find({ 
      companyId: requestingUser.companyId 
    }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({ 
      homes,
      count: homes.length
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Home verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getHome,
  createHome,
  updateHome,
  deleteHome,
  getAllHome
}; 