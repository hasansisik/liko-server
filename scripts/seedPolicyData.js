require('dotenv').config();
const mongoose = require('mongoose');
const Policy = require('../models/Policy');
const connectDB = require('../config/connectDB');

// MongoDB connection string - use a local MongoDB instance
const MONGODB_URI = "mongodb://localhost:27017/liko";

// Data from the existing policy-data.ts file
const policyData = {
  privacyPolicy: {
    title: "Privacy Policy",
    subtitle: "Liko Dental",
    type: "privacy-policy",
    htmlContent: `
    <h3>1. Introduction</h3>
    <p>At Liko Dental, we are committed to protecting your privacy and maintaining the confidentiality of your personal and health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our dental services.</p>

    <h3>2. Information We Collect</h3>
    <h4>2.1 Personal Information</h4>
    <p>We may collect the following types of personal information:</p>
    <ul>
      <li>Contact information (name, address, phone number, email)</li>
      <li>Demographic information (age, gender, date of birth)</li>
      <li>Insurance information</li>
      <li>Emergency contact information</li>
      <li>Payment and billing information</li>
    </ul>

    <h4>2.2 Health Information</h4>
    <p>As a dental practice, we collect and maintain:</p>
    <ul>
      <li>Medical and dental history</li>
      <li>Treatment records and notes</li>
      <li>Diagnostic information and test results</li>
      <li>X-rays and other imaging</li>
      <li>Prescription and medication information</li>
    </ul>

    <h4>2.3 Website Information</h4>
    <p>When you visit our website, we may collect:</p>
    <ul>
      <li>IP address and browser information</li>
      <li>Pages visited and time spent on site</li>
      <li>Cookies and similar tracking technologies</li>
    </ul>

    <h3>3. How We Use Your Information</h3>
    <p>We use your information for the following purposes:</p>
    <ul>
      <li>Providing dental care and treatment</li>
      <li>Scheduling appointments and sending reminders</li>
      <li>Processing insurance claims and billing</li>
      <li>Communicating about your treatment</li>
      <li>Maintaining accurate medical records</li>
      <li>Improving our services and website</li>
      <li>Complying with legal and regulatory requirements</li>
    </ul>

    <h3>4. Information Sharing and Disclosure</h3>
    <p>We may share your information in the following circumstances:</p>
    <ul>
      <li><strong>Healthcare Providers:</strong> With other healthcare professionals involved in your care</li>
      <li><strong>Insurance Companies:</strong> For claims processing and pre-authorization</li>
      <li><strong>Legal Requirements:</strong> When required by law or court order</li>
      <li><strong>Business Associates:</strong> With vendors who assist in our operations (under strict confidentiality agreements)</li>
      <li><strong>Emergency Situations:</strong> To protect your health and safety</li>
    </ul>

    <h3>5. Data Security</h3>
    <p>We implement appropriate technical, administrative, and physical safeguards to protect your information, including:</p>
    <ul>
      <li>Encrypted data transmission and storage</li>
      <li>Access controls and user authentication</li>
      <li>Regular security assessments and updates</li>
      <li>Staff training on privacy and security</li>
      <li>Secure disposal of records</li>
    </ul>

    <h3>6. Your Rights</h3>
    <p>You have the right to:</p>
    <ul>
      <li>Access and review your personal information</li>
      <li>Request corrections to inaccurate information</li>
      <li>Request restrictions on use or disclosure</li>
      <li>Receive a copy of your health records</li>
      <li>File a complaint about our privacy practices</li>
      <li>Opt-out of marketing communications</li>
    </ul>

    <h3>7. Retention of Information</h3>
    <p>We retain your information for as long as necessary to provide services and comply with legal requirements. Dental records are typically maintained for a minimum of 7 years after your last visit, or longer as required by state law.</p>

    <h3>8. Children's Privacy</h3>
    <p>We provide dental services to patients of all ages. For patients under 18, we obtain parental consent before collecting or using their information, except in emergency situations or as otherwise permitted by law.</p>

    <h3>9. Website Cookies</h3>
    <p>Our website uses cookies to enhance your browsing experience. You can control cookie settings through your browser preferences. Some features may not function properly if cookies are disabled.</p>

    <h3>10. Changes to This Policy</h3>
    <p>We may update this Privacy Policy periodically. We will notify you of significant changes by posting the updated policy on our website and updating the "Last Updated" date.</p>

    <h3>11. Contact Us</h3>
    <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
    <p><strong>Liko Dental</strong><br/>
    740 NEW SOUTH HEAD RD, TRIPLE BAY SWFW 3108, NEW YORK<br/>
    Phone: + 725 214 456<br/>
    Email: contact@liko.com</p>
    `,
    companyId: "default",
    isActive: true
  },
  termsOfService: {
    title: "Terms of Service",
    subtitle: "Liko Dental",
    type: "terms-of-service",
    htmlContent: `
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing our website or using our dental services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.</p>

    <h3>2. Dental Services</h3>
    <h4>2.1 Professional Relationship</h4>
    <p>Liko Dental provides professional dental services. A doctor-patient relationship is established only after an in-person consultation and examination. Online communications do not constitute a doctor-patient relationship.</p>

    <h4>2.2 Treatment Plans</h4>
    <p>All treatment plans are recommendations based on clinical examination and diagnostic findings. Patients have the right to accept, refuse, or seek alternative treatment options.</p>

    <h3>3. Appointments and Scheduling</h3>
    <h4>3.1 Appointment Booking</h4>
    <ul>
      <li>Appointments can be scheduled online, by phone, or in person</li>
      <li>Confirmation is required for all appointments</li>
      <li>We reserve the right to confirm insurance coverage before treatment</li>
    </ul>

    <h4>3.2 Cancellation Policy</h4>
    <ul>
      <li>24-hour notice is required for appointment cancellations</li>
      <li>Late cancellations or no-shows may result in a fee</li>
      <li>Repeated no-shows may result in dismissal from the practice</li>
    </ul>

    <h3>4. Payment and Insurance</h3>
    <h4>4.1 Payment Terms</h4>
    <ul>
      <li>Payment is due at the time of service unless other arrangements are made</li>
      <li>We accept cash, credit cards, and dental insurance</li>
      <li>Payment plans may be available for extensive treatment</li>
    </ul>

    <h4>4.2 Insurance</h4>
    <ul>
      <li>Insurance coverage verification is the patient's responsibility</li>
      <li>We will file insurance claims as a courtesy</li>
      <li>Patients are responsible for all charges not covered by insurance</li>
    </ul>

    <h3>5. Patient Responsibilities</h3>
    <p>Patients are expected to:</p>
    <ul>
      <li>Provide accurate and complete medical and dental history</li>
      <li>Follow pre and post-treatment instructions</li>
      <li>Maintain good oral hygiene</li>
      <li>Attend scheduled appointments and follow-up visits</li>
      <li>Inform us of any changes in health status or medications</li>
      <li>Treat staff and other patients with respect</li>
    </ul>

    <h3>6. Treatment Outcomes</h3>
    <p>While we strive for the best possible outcomes, dental treatment results cannot be guaranteed. Factors affecting treatment success include:</p>
    <ul>
      <li>Patient compliance with instructions</li>
      <li>Individual healing responses</li>
      <li>Underlying health conditions</li>
      <li>Oral hygiene maintenance</li>
    </ul>

    <h3>7. Emergency Care</h3>
    <p>For dental emergencies during office hours, contact our office immediately. After-hours emergency instructions are provided on our voicemail. For life-threatening emergencies, call 911.</p>

    <h3>8. Privacy and Confidentiality</h3>
    <p>We are committed to protecting your privacy in accordance with HIPAA regulations and our Privacy Policy. Patient information will only be disclosed with written consent or as required by law.</p>

    <h3>9. Website Use</h3>
    <h4>9.1 Permitted Use</h4>
    <p>Our website is intended for informational purposes and appointment scheduling. You may not use our website for any unlawful purpose or in any way that could damage our reputation or services.</p>

    <h4>9.2 Content Accuracy</h4>
    <p>While we strive to provide accurate information, website content is for general information only and should not replace professional dental advice.</p>

    <h3>10. Limitation of Liability</h3>
    <p>To the fullest extent permitted by law, Liko Dental shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or website.</p>

    <h3>11. Termination of Services</h3>
    <p>We reserve the right to terminate the doctor-patient relationship for reasons including but not limited to:</p>
    <ul>
      <li>Non-compliance with treatment recommendations</li>
      <li>Abusive behavior toward staff</li>
      <li>Repeated missed appointments</li>
      <li>Non-payment of fees</li>
    </ul>

    <h3>12. Governing Law</h3>
    <p>These terms are governed by the laws of New York State. Any disputes will be resolved in the courts of New York.</p>

    <h3>13. Changes to Terms</h3>
    <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.</p>

    <h3>14. Contact Information</h3>
    <p>For questions about these Terms of Service, please contact us:</p>
    <p><strong>Liko Dental</strong><br/>
    740 NEW SOUTH HEAD RD, TRIPLE BAY SWFW 3108, NEW YORK<br/>
    Phone: + 725 214 456<br/>
    Email: contact@liko.com</p>
    `,
    companyId: "default",
    isActive: true
  },
  cookiePolicy: {
    title: "Cookie Policy",
    subtitle: "Liko Dental",
    type: "cookie-policy",
    htmlContent: `
    <h3>1. What Are Cookies?</h3>
    <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience and enable certain website features to function properly.</p>

    <h3>2. How We Use Cookies</h3>
    <p>Liko Dental uses cookies for the following purposes:</p>
    <ul>
      <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
      <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
      <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
      <li><strong>Analytics Cookies:</strong> Provide insights into website usage and performance</li>
    </ul>

    <h3>3. Types of Cookies We Use</h3>
    
    <h4>3.1 Strictly Necessary Cookies</h4>
    <p>These cookies are essential for our website to function properly. They enable basic functions like page navigation, appointment booking, and access to secure areas of the website.</p>
    <ul>
      <li>Session management cookies</li>
      <li>Security cookies</li>
      <li>Load balancing cookies</li>
    </ul>

    <h4>3.2 Performance and Analytics Cookies</h4>
    <p>These cookies help us understand how visitors interact with our website by collecting anonymous information about:</p>
    <ul>
      <li>Pages visited and time spent on each page</li>
      <li>How visitors navigate through the site</li>
      <li>Error pages encountered</li>
      <li>How users arrived at our website (e.g., search engines, referral links)</li>
    </ul>

    <h3>4. Managing Cookies</h3>
    <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
    <p>Most web browsers allow some control of cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="http://www.allaboutcookies.org" target="_blank">www.allaboutcookies.org</a>.</p>
    <p>Please note that if you disable cookies, some features of our website may not function properly.</p>

    <h3>5. Third-Party Cookies</h3>
    <p>We may use third-party services that set cookies on our behalf, including:</p>
    <ul>
      <li>Google Analytics (website analytics)</li>
      <li>Social media platforms (sharing capabilities)</li>
      <li>Online appointment booking systems</li>
      <li>Chat support services</li>
    </ul>
    <p>These services may set their own cookies, which are subject to their respective privacy policies.</p>

    <h3>6. Updates to This Cookie Policy</h3>
    <p>We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page with an updated revision date.</p>

    <h3>7. Contact Us</h3>
    <p>If you have questions about our use of cookies, please contact us:</p>
    <p><strong>Liko Dental</strong><br/>
    740 NEW SOUTH HEAD RD, TRIPLE BAY SWFW 3108, NEW YORK<br/>
    Phone: + 725 214 456<br/>
    Email: contact@liko.com</p>
    `,
    companyId: "default",
    isActive: true
  }
};

// Function to seed the database
const seedPolicyData = async () => {
  try {
    // Connect to the database
    await connectDB(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing policy data
    await Policy.deleteMany({});
    console.log('Cleared existing policy data');

    // Create new policy documents
    const privacyPolicy = new Policy(policyData.privacyPolicy);
    const termsOfService = new Policy(policyData.termsOfService);
    const cookiePolicy = new Policy(policyData.cookiePolicy);

    // Save the documents to the database
    await privacyPolicy.save();
    await termsOfService.save();
    await cookiePolicy.save();

    console.log('Policy data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding policy data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedPolicyData(); 