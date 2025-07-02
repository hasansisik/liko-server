const FormSubmission = require("../models/FormSubmission");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Submit a new form (Public - no auth required)
const submitForm = async (req, res) => {
  try {
    const { name, phone, countryCode, countryName, message = "", companyId = "default" } = req.body;
    console.log("Form submission request received:", { name, phone, countryCode, countryName, message, companyId });

    if (!name || !phone || !countryCode || !countryName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Lütfen tüm alanları doldurunuz",
      });
    }

    const formSubmission = new FormSubmission({
      name,
      phone,
      countryCode,
      countryName,
      message,
      companyId,
    });

    await formSubmission.save();

    res.status(StatusCodes.CREATED).json({
      message: "Form submitted successfully",
      formSubmission,
    });
  } catch (error) {
    console.error("Error in submitForm:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Form gönderilirken bir hata oluştu",
      error: error.message,
    });
  }
};

// Get all form submissions (Admin/Editor Only)
const getAllFormSubmissions = async (req, res) => {
  try {
    console.log("getAllFormSubmissions called with user:", req.user);
    const requestingUser = await User.findById(req.user.userId);
    console.log("Requesting user found:", requestingUser ? requestingUser.email : "Not found");

    // Check if the requesting user is admin or editor
    if (!["admin", "editor"].includes(requestingUser.role)) {
      console.log("User role not authorized:", requestingUser.role);
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir",
      });
    }

    // Build query - only filter by companyId, no other filters
    // MongoDB'de "default" olarak saklanan verileri de göster
    const query = { 
      $or: [
        { companyId: requestingUser.companyId },
        { companyId: "default" }
      ]
    };
    console.log("Query built:", query);

    // Build sort options - always sort by createdAt desc
    const sortOptions = { createdAt: -1 };
    console.log("Sort options:", sortOptions);

    const formSubmissions = await FormSubmission.find(query)
      .sort(sortOptions)
      .lean();
    
    console.log(`Found ${formSubmissions.length} form submissions`);
    
    // Return the data
    return res.status(StatusCodes.OK).json({ formSubmissions });
  } catch (error) {
    console.error("Error in getAllFormSubmissions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Form verileri alınırken bir hata oluştu",
      error: error.message,
    });
  }
};

// Get a single form submission (Admin/Editor Only)
const getFormSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!["admin", "editor"].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir",
      });
    }

    const formSubmission = await FormSubmission.findById(submissionId);

    if (!formSubmission) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Form verisi bulunamadı",
      });
    }

    res.status(StatusCodes.OK).json({ formSubmission });
  } catch (error) {
    console.error("Error in getFormSubmission:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Form verisi alınırken bir hata oluştu",
      error: error.message,
    });
  }
};

// Update a form submission (Admin/Editor Only)
const updateFormSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, notes, isArchived } = req.body;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin or editor
    if (!["admin", "editor"].includes(requestingUser.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin veya editor yapabilir",
      });
    }

    const formSubmission = await FormSubmission.findById(submissionId);

    if (!formSubmission) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Form verisi bulunamadı",
      });
    }

    // Update fields if provided
    if (status) formSubmission.status = status;
    if (notes !== undefined) formSubmission.notes = notes;
    if (isArchived !== undefined) formSubmission.isArchived = isArchived;

    await formSubmission.save();

    res.status(StatusCodes.OK).json({
      message: "Form verisi güncellendi",
      formSubmission,
    });
  } catch (error) {
    console.error("Error in updateFormSubmission:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Form verisi güncellenirken bir hata oluştu",
      error: error.message,
    });
  }
};

// Delete a form submission (Admin Only)
const deleteFormSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bu işlemi sadece admin yapabilir",
      });
    }

    const formSubmission = await FormSubmission.findById(submissionId);

    if (!formSubmission) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Form verisi bulunamadı",
      });
    }

    await FormSubmission.findByIdAndDelete(submissionId);

    res.status(StatusCodes.OK).json({
      message: "Form verisi başarıyla silindi",
    });
  } catch (error) {
    console.error("Error in deleteFormSubmission:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Form verisi silinirken bir hata oluştu",
      error: error.message,
    });
  }
};

module.exports = {
  submitForm,
  getAllFormSubmissions,
  getFormSubmission,
  updateFormSubmission,
  deleteFormSubmission,
}; 