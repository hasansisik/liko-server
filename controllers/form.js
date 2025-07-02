const Form = require("../models/Form");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Default form data
const defaultFormData = {
  title: "Let's Talk Teeth!",
  subtitle: "Online now",
  responseTime: "avg. response time: 3 minutes",
  showWhatsApp: true,
  whatsAppText: "Chat on WhatsApp",
  whatsAppLink: "https://wa.me/905321234567",
  submitButtonText: "Send",
  placeholders: {
    name: "Name*",
    phone: "Phone Number*",
    countrySearch: "Search country..."
  },
  defaultCountry: "TR",
  countries: [
    { name: "Turkey", code: "TR", flag: "🇹🇷", phone: "+90" },
    { name: "United States", code: "US", flag: "🇺🇸", phone: "+1" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧", phone: "+44" },
    { name: "Germany", code: "DE", flag: "🇩🇪", phone: "+49" },
    { name: "France", code: "FR", flag: "🇫🇷", phone: "+33" },
    { name: "Italy", code: "IT", flag: "🇮🇹", phone: "+39" },
    { name: "Spain", code: "ES", flag: "🇪🇸", phone: "+34" },
    { name: "Netherlands", code: "NL", flag: "🇳🇱", phone: "+31" },
    { name: "Belgium", code: "BE", flag: "🇧🇪", phone: "+32" },
    { name: "Switzerland", code: "CH", flag: "🇨🇭", phone: "+41" },
    { name: "Austria", code: "AT", flag: "🇦🇹", phone: "+43" },
    { name: "Sweden", code: "SE", flag: "🇸🇪", phone: "+46" },
    { name: "Norway", code: "NO", flag: "🇳🇴", phone: "+47" },
    { name: "Denmark", code: "DK", flag: "🇩🇰", phone: "+45" },
    { name: "Finland", code: "FI", flag: "🇫🇮", phone: "+358" },
    { name: "Poland", code: "PL", flag: "🇵🇱", phone: "+48" },
    { name: "Czech Republic", code: "CZ", flag: "🇨🇿", phone: "+420" },
    { name: "Hungary", code: "HU", flag: "🇭🇺", phone: "+36" },
    { name: "Romania", code: "RO", flag: "🇷🇴", phone: "+40" },
    { name: "Bulgaria", code: "BG", flag: "🇧🇬", phone: "+359" },
    { name: "Greece", code: "GR", flag: "🇬🇷", phone: "+30" },
    { name: "Portugal", code: "PT", flag: "🇵🇹", phone: "+351" },
    { name: "Ireland", code: "IE", flag: "🇮🇪", phone: "+353" },
    { name: "Luxembourg", code: "LU", flag: "🇱🇺", phone: "+352" },
    { name: "Cyprus", code: "CY", flag: "🇨🇾", phone: "+357" },
    { name: "Malta", code: "MT", flag: "🇲🇹", phone: "+356" },
    { name: "Canada", code: "CA", flag: "🇨🇦", phone: "+1" },
    { name: "Australia", code: "AU", flag: "🇦🇺", phone: "+61" },
    { name: "New Zealand", code: "NZ", flag: "🇳🇿", phone: "+64" },
    { name: "Japan", code: "JP", flag: "🇯🇵", phone: "+81" },
    { name: "South Korea", code: "KR", flag: "🇰🇷", phone: "+82" },
    { name: "China", code: "CN", flag: "🇨🇳", phone: "+86" },
    { name: "India", code: "IN", flag: "🇮🇳", phone: "+91" },
    { name: "Singapore", code: "SG", flag: "🇸🇬", phone: "+65" },
    { name: "Malaysia", code: "MY", flag: "🇲🇾", phone: "+60" },
    { name: "Thailand", code: "TH", flag: "🇹🇭", phone: "+66" },
    { name: "Philippines", code: "PH", flag: "🇵🇭", phone: "+63" },
    { name: "Indonesia", code: "ID", flag: "🇮🇩", phone: "+62" },
    { name: "Vietnam", code: "VN", flag: "🇻🇳", phone: "+84" },
    { name: "UAE", code: "AE", flag: "🇦🇪", phone: "+971" },
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", phone: "+966" },
    { name: "Qatar", code: "QA", flag: "🇶🇦", phone: "+974" },
    { name: "Kuwait", code: "KW", flag: "🇰🇼", phone: "+965" },
    { name: "Bahrain", code: "BH", flag: "🇧🇭", phone: "+973" },
    { name: "Oman", code: "OM", flag: "🇴🇲", phone: "+968" },
    { name: "Jordan", code: "JO", flag: "🇯🇴", phone: "+962" },
    { name: "Lebanon", code: "LB", flag: "🇱🇧", phone: "+961" },
    { name: "Israel", code: "IL", flag: "🇮🇱", phone: "+972" },
    { name: "Egypt", code: "EG", flag: "🇪🇬", phone: "+20" },
    { name: "South Africa", code: "ZA", flag: "🇿🇦", phone: "+27" },
    { name: "Nigeria", code: "NG", flag: "🇳🇬", phone: "+234" },
    { name: "Kenya", code: "KE", flag: "🇰🇪", phone: "+254" },
    { name: "Morocco", code: "MA", flag: "🇲🇦", phone: "+212" },
    { name: "Tunisia", code: "TN", flag: "🇹🇳", phone: "+216" },
    { name: "Algeria", code: "DZ", flag: "🇩🇿", phone: "+213" },
    { name: "Brazil", code: "BR", flag: "🇧🇷", phone: "+55" },
    { name: "Argentina", code: "AR", flag: "🇦🇷", phone: "+54" },
    { name: "Chile", code: "CL", flag: "🇨🇱", phone: "+56" },
    { name: "Colombia", code: "CO", flag: "🇨🇴", phone: "+57" },
    { name: "Peru", code: "PE", flag: "🇵🇪", phone: "+51" },
    { name: "Mexico", code: "MX", flag: "🇲🇽", phone: "+52" },
    { name: "Venezuela", code: "VE", flag: "🇻🇪", phone: "+58" },
    { name: "Ecuador", code: "EC", flag: "🇪🇨", phone: "+593" },
    { name: "Uruguay", code: "UY", flag: "🇺🇾", phone: "+598" },
    { name: "Paraguay", code: "PY", flag: "🇵🇾", phone: "+595" },
    { name: "Bolivia", code: "BO", flag: "🇧🇴", phone: "+591" },
    { name: "Russia", code: "RU", flag: "🇷🇺", phone: "+7" },
    { name: "Ukraine", code: "UA", flag: "🇺🇦", phone: "+380" },
    { name: "Belarus", code: "BY", flag: "🇧🇾", phone: "+375" },
    { name: "Kazakhstan", code: "KZ", flag: "🇰🇿", phone: "+7" },
    { name: "Uzbekistan", code: "UZ", flag: "🇺🇿", phone: "+998" },
    { name: "Azerbaijan", code: "AZ", flag: "🇦🇿", phone: "+994" },
    { name: "Armenia", code: "AM", flag: "🇦🇲", phone: "+374" },
    { name: "Georgia", code: "GE", flag: "🇬🇪", phone: "+995" }
  ]
};

// Get Form Data (Public - no auth required)
const getForm = async (req, res) => {
  try {
    // For public access, get the first active form data or use companyId from query
    const companyId = req.query.companyId;
    
    let form;
    if (companyId) {
      form = await Form.findOne({ 
        companyId: companyId,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active form
      form = await Form.findOne({ 
        isActive: true 
      });
    }

    if (!form) {
      // Create a default form if none exists
      const defaultForm = new Form({
        ...defaultFormData,
        companyId: companyId || "default",
        isActive: true
      });
      
      await defaultForm.save();
      return res.status(StatusCodes.OK).json({ form: defaultForm });
    }
    
    res.status(StatusCodes.OK).json({ form });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Form verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

// Create Form Data (Admin/Editor Only)
const createForm = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const { title, subtitle, responseTime, showWhatsApp, whatsAppText, whatsAppLink, submitButtonText, placeholders, defaultCountry, countries } = req.body;

    // Mevcut aktif form'u pasif yap
    await Form.updateMany(
      { isActive: true },
      { isActive: false }
    );

    const form = new Form({
      title,
      subtitle,
      responseTime,
      showWhatsApp,
      whatsAppText,
      whatsAppLink,
      submitButtonText,
      placeholders,
      defaultCountry,
      countries,
      companyId: "default",
      isActive: true
    });

    await form.save();

    res.status(StatusCodes.CREATED).json({
      message: "Form verisi başarıyla oluşturuldu",
      form
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Form verisi oluşturulurken bir hata oluştu",
      error: error.message
    });
  }
};

// Update Form Data (Admin/Editor Only)
const updateForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!['admin', 'editor'].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin veya editor yapabilir" 
      });
    }

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Form verisi bulunamadı" 
      });
    }

    // Allow editing regardless of company

    const { title, subtitle, responseTime, showWhatsApp, whatsAppText, whatsAppLink, submitButtonText, placeholders, defaultCountry, countries } = req.body;

    if (title) form.title = title;
    if (subtitle) form.subtitle = subtitle;
    if (responseTime) form.responseTime = responseTime;
    if (typeof showWhatsApp === 'boolean') form.showWhatsApp = showWhatsApp;
    if (whatsAppText) form.whatsAppText = whatsAppText;
    if (whatsAppLink) form.whatsAppLink = whatsAppLink;
    if (submitButtonText) form.submitButtonText = submitButtonText;
    if (placeholders) form.placeholders = { ...form.placeholders, ...placeholders };
    if (defaultCountry) form.defaultCountry = defaultCountry;
    if (countries) form.countries = countries;

    await form.save();

    res.status(StatusCodes.OK).json({ 
      message: "Form verisi güncellendi",
      form
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Form verisi güncellenirken bir hata oluştu",
      error: error.message
    });
  }
};

// Delete Form Data (Admin Only)
const deleteForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Form verisi bulunamadı" 
      });
    }

    // Allow deleting regardless of company

    await Form.findByIdAndDelete(formId);

    res.status(StatusCodes.OK).json({ 
      message: "Form verisi başarıyla silindi" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Form verisi silinirken bir hata oluştu",
      error: error.message
    });
  }
};

// Get All Form Data (Admin Only)
const getAllForm = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Bu işlemi sadece admin yapabilir" 
      });
    }

    const formList = await Form.find({})
      .sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({ formList });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Form verileri alınırken bir hata oluştu",
      error: error.message
    });
  }
};

module.exports = {
  getForm,
  createForm,
  updateForm,
  deleteForm,
  getAllForm
}; 
 

 