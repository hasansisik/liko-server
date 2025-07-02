const Contact = require("../models/Contact");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get Contact Data (Public - no auth required)
const getContact = async (req, res) => {
  try {
    // For public access, get the first active contact data or use companyId from query
    const companyId = req.query.companyId;
    
    let contact;
    if (companyId) {
      contact = await Contact.findOne({ 
        companyId: companyId,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active contact
      contact = await Contact.findOne({ 
        isActive: true 
      });
    }

    if (!contact) {
      // Return default data if no contact found
      const defaultContact = {
        hero: {
          backgroundImage: "/assets/img/home-01/team/team-details-bg.png",
          subtitle: "Liko Studio",
          title: "Get in touch"
        },
        contactForm: {
          title: "Send a Message",
          subtitle: "Contact Us",
          socialText: "Follow us",
          socialMedia: [
            {
              id: 1,
              name: "LinkedIn",
              link: "https://www.linkedin.com/company/birimajans"
            },
            {
              id: 2,
              name: "Twitter",
              link: "https://twitter.com/birimajans"
            },
            {
              id: 3,
              name: "Instagram",
              link: "https://www.instagram.com/birimajans"
            },
            {
              id: 4,
              name: "Facebook",
              link: "https://www.facebook.com/birimajans"
            }
          ],
          form: {
            nameLabel: "Name",
            namePlaceholder: "John Doe",
            subjectLabel: "Subject", 
            subjectPlaceholder: "Your@email.com",
            messageLabel: "Message",
            messagePlaceholder: "Tell Us About Your Project",
            buttonText: "Send Message"
          }
        },
        contactInfo: {
          locations: [
            {
              id: 1,
              img: "/assets/img/home-01/tr.jpg",
              country: "Istanbul",
              time: "12:00 pm GMT+3",
              locationTitle: "Birim Ajans Clinic",
              address: "Birim Studio, 43 Appleton <br /> Lane, 3287 Istanbul",
              phone: "(+90) 532 123 45 67",
              email: "info@birimajans.com",
              mapsText: "Google Maps",
              mapsUrl: "https://www.google.com/maps"
            }
          ]
        }
      };

      return res.status(StatusCodes.OK).json({ contact: defaultContact });
    }
    
    res.status(StatusCodes.OK).json({ contact });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Contact verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Contact Data (Admin/Editor Only)
const createContact = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { hero, contactForm, contactInfo } = req.body;

    // Mevcut aktif contact'ı pasif yap
    await Contact.updateMany(
      { companyId: requestingUser.companyId, isActive: true },
      { isActive: false }
    );

    const contact = new Contact({
      hero,
      contactForm,
      contactInfo,
      companyId: requestingUser.companyId,
      isActive: true
    });

    await contact.save();

    res.status(StatusCodes.CREATED).json({
      message: "Contact verisi başarıyla oluşturuldu",
      contact
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Contact verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Contact Data (Admin/Editor Only)
const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Contact verisi bulunamadı" 
      });
    }

    // Check if contact belongs to the same company
    if (contact.companyId !== requestingUser.companyId) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Farklı şirket verilerini düzenleyemezsiniz" 
      });
    }

    const { hero, contactForm, contactInfo } = req.body;

    if (hero) contact.hero = { ...contact.hero, ...hero };
    if (contactForm) contact.contactForm = { ...contact.contactForm, ...contactForm };
    if (contactInfo) contact.contactInfo = { ...contact.contactInfo, ...contactInfo };

    await contact.save();

    res.status(StatusCodes.OK).json({ 
      message: "Contact verisi güncellendi",
      contact
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Contact verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Contact Data (Admin Only)
const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Contact verisi bulunamadı" 
      });
    }

    // Check if contact belongs to the same company
    if (contact.companyId !== requestingUser.companyId) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Farklı şirket verilerini silemezsiniz" 
      });
    }

    await Contact.findByIdAndDelete(contactId);

    res.status(StatusCodes.OK).json({ 
      message: "Contact verisi başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Contact verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All Contact Data (Admin Only)
const getAllContact = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const contactList = await Contact.find({ companyId: requestingUser.companyId })
      .sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({ contactList });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Contact verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getAllContact
}; 