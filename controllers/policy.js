const Policy = require("../models/Policy");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get Policy Data (Public - no auth required)
const getPolicy = async (req, res) => {
  try {
    // For public access, get the first active policy data or use companyId from query
    const { type } = req.params;
    const companyId = req.query.companyId;
    
    if (!type || !["privacy-policy", "terms-of-service", "cookie-policy"].includes(type)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid policy type"
      });
    }
    
    let policy;
    if (companyId) {
      policy = await Policy.findOne({ 
        companyId: companyId,
        type: type,
        isActive: true 
      });
    } else {
      // If no companyId provided, get the first available active policy
      policy = await Policy.findOne({ 
        type: type,
        isActive: true 
      });
    }

    if (!policy) {
      // Return default data if no policy found
      const defaultPolicy = {
        title: type === "privacy-policy" ? "Privacy Policy" : 
               type === "terms-of-service" ? "Terms of Service" : "Cookie Policy",
        subtitle: "Liko Dental",
        type: type,
        htmlContent: `<p>Default ${type.replace("-", " ")} content. Please add content.</p>`,
        lastUpdated: new Date()
      };

      return res.status(StatusCodes.OK).json({ policy: defaultPolicy });
    }
    
    res.status(StatusCodes.OK).json({ policy });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Policy data retrieval failed",
      error: error.message
    });
  }
};

// Create Policy Data (Admin Only)
const createPolicy = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Only admin can perform this action" 
      });
    }

    const { title, subtitle, type, htmlContent } = req.body;

    if (!type || !["privacy-policy", "terms-of-service", "cookie-policy"].includes(type)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid policy type"
      });
    }

    // Deactivate existing active policies of the same type
    await Policy.updateMany(
      { companyId: requestingUser.companyId, type: type, isActive: true },
      { isActive: false }
    );

    const policy = new Policy({
      title,
      subtitle,
      type,
      htmlContent,
      companyId: requestingUser.companyId,
      isActive: true
    });

    await policy.save();

    res.status(StatusCodes.CREATED).json({
      message: "Policy created successfully",
      policy
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create policy",
      error: error.message
    });
  }
};

// Update Policy Data (Admin Only)
const updatePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Only admin can perform this action" 
      });
    }

    const policy = await Policy.findById(policyId);
    if (!policy) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Policy not found" 
      });
    }

    const { title, subtitle, htmlContent } = req.body;

    if (title) policy.title = title;
    if (subtitle) policy.subtitle = subtitle;
    if (htmlContent) policy.htmlContent = htmlContent;
    
    // Update the lastUpdated timestamp
    policy.lastUpdated = new Date();

    await policy.save();

    res.status(StatusCodes.OK).json({ 
      message: "Policy updated successfully",
      policy
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update policy",
      error: error.message
    });
  }
};

// Delete Policy Data (Admin Only)
const deletePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Only admin can perform this action" 
      });
    }

    const policy = await Policy.findById(policyId);
    if (!policy) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Policy not found" 
      });
    }

    await Policy.findByIdAndDelete(policyId);

    res.status(StatusCodes.OK).json({ 
      message: "Policy deleted successfully" 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete policy",
      error: error.message
    });
  }
};

// Get All Policies (Admin Only)
const getAllPolicies = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);

    // Check if the requesting user is admin
    if (requestingUser.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Only admin can perform this action" 
      });
    }

    const policies = await Policy.find({ companyId: requestingUser.companyId })
      .sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({ policies });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Failed to retrieve policies",
      error: error.message
    });
  }
};

module.exports = {
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getAllPolicies
}; 