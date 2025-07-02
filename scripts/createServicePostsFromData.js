const axios = require('axios');

const server = 'http://localhost:3040/v1';

// service-data.ts'den alınan veriler (JavaScript format'ına çevrilmiş)
const serviceDataPosts = [
  {
    title: "Hollywood Smile",
    img: "/assets/img/inner-service/service/service-1.jpg",
    images: [
      "/assets/img/inner-service/service/service-1.jpg",
      "/assets/img/inner-service/service/service-2.jpg"
    ],
    categories: ["Cosmetic Dentistry", "Aesthetic Enhancement"],
    tags: ["hollywood", "smile", "cosmetic", "aesthetic", "whitening"],
    desc: "Transform your smile with our Hollywood Smile treatment, featuring perfect white teeth and flawless alignment.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Hollywood Smile is a comprehensive cosmetic dental treatment that combines multiple procedures to create the perfect, camera-ready smile. This treatment is designed to give you the confidence of a movie star with perfectly aligned, brilliantly white teeth.</p>
        </div>
        
        <div class="service-details-content">
          <h4 class="service-details-title">What is Hollywood Smile?</h4>
          <p class="mb-20">Hollywood Smile is a complete smile makeover that typically includes teeth whitening, veneers, crowns, and sometimes orthodontic treatment. The goal is to create a symmetrical, bright, and perfectly proportioned smile.</p>
          <p>This treatment addresses multiple aesthetic concerns including discoloration, misalignment, gaps, chips, and irregular tooth shapes.</p>
        </div>
        
        <div class="service-details-process">
          <h4 class="service-details-title">Treatment Process</h4>
          <ul class="service-process-list">
            <li><strong>Consultation & Planning:</strong> Comprehensive examination and digital smile design</li>
            <li><strong>Preparation:</strong> Tooth preparation and temporary restoration placement</li>
            <li><strong>Fabrication:</strong> Custom creation of veneers or crowns in our lab</li>
            <li><strong>Final Placement:</strong> Precise bonding and final adjustments</li>
          </ul>
        </div>
        
        <div class="service-details-benefits">
          <h4 class="service-details-title">Benefits</h4>
          <div class="row">
            <div class="col-md-6">
              <ul class="benefit-list">
                <li>Dramatic aesthetic improvement</li>
                <li>Boost in self-confidence</li>
                <li>Long-lasting results</li>
                <li>Natural-looking appearance</li>
              </ul>
            </div>
            <div class="col-md-6">
              <ul class="benefit-list">
                <li>Stain-resistant materials</li>
                <li>Improved oral health</li>
                <li>Customized to your face</li>
                <li>Minimal maintenance required</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="service-details-aftercare">
          <h4 class="service-details-title">Aftercare Instructions</h4>
          <p>Proper care ensures your Hollywood Smile lasts for many years. Regular dental hygiene, avoiding hard foods initially, and routine check-ups are essential for maintaining your new smile.</p>
        </div>
      `
    },
    author: "Dr. Aesthetic Specialist",
    isPublished: true,
    blogQuote: false,
    video: false,
    imgSlider: true,
    blogQuoteTwo: false,
    blogHeroSlider: false,
    videoId: ""
  },
  {
    title: "Dental Veneers",
    img: "/assets/img/inner-service/service/service-2.jpg",
    images: ["/assets/img/inner-service/service/service-2.jpg"],
    categories: ["Cosmetic Dentistry", "Aesthetic Enhancement"],
    tags: ["veneers", "porcelain", "cosmetic", "smile", "aesthetic"],
    desc: "Ultra-thin porcelain shells that cover the front surface of teeth to improve appearance and function.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Dental veneers are wafer-thin, custom-made shells of tooth-colored materials designed to cover the front surface of teeth. They're an excellent solution for improving the appearance of your smile.</p>
        </div>
        
        <div class="service-details-content">
          <h4 class="service-details-title">What are Dental Veneers?</h4>
          <p class="mb-20">Veneers are thin shells that are bonded to the front of your teeth. They can be made from porcelain or composite resin materials. Porcelain veneers resist stains better than composite veneers and better mimic the light reflecting properties of natural teeth.</p>
          <p>They're used to fix teeth that are discolored, worn down, chipped, broken, misaligned, uneven, or irregularly shaped, or have gaps between them.</p>
        </div>
        
        <div class="service-details-types">
          <h4 class="service-details-title">Types of Veneers</h4>
          <div class="row">
            <div class="col-md-6">
              <h5>Porcelain Veneers</h5>
              <ul>
                <li>Superior stain resistance</li>
                <li>Natural light reflection</li>
                <li>Longer lasting (10-15 years)</li>
                <li>Custom laboratory fabrication</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h5>Composite Veneers</h5>
              <ul>
                <li>More affordable option</li>
                <li>Can be completed in one visit</li>
                <li>Easily repairable</li>
                <li>Less tooth preparation required</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="service-details-procedure">
          <h4 class="service-details-title">Procedure Steps</h4>
          <ol class="procedure-steps">
            <li><strong>Consultation:</strong> Examination and treatment planning</li>
            <li><strong>Preparation:</strong> Removal of small amount of enamel</li>
            <li><strong>Impression:</strong> Taking molds for custom fabrication</li>
            <li><strong>Temporary Veneers:</strong> Placement while permanent ones are made</li>
            <li><strong>Bonding:</strong> Permanent attachment of final veneers</li>
          </ol>
        </div>
        
        <div class="service-details-care">
          <h4 class="service-details-title">Care Instructions</h4>
          <p>Maintain your veneers with regular brushing, flossing, and dental visits. Avoid biting hard objects and consider a night guard if you grind your teeth.</p>
        </div>
      `
    },
    author: "Dr. Cosmetic Expert",
    isPublished: true,
    blogQuote: true,
    video: false,
    imgSlider: false,
    blogQuoteTwo: false,
    blogHeroSlider: false,
    videoId: ""
  },
  {
    title: "Dental Implants",
    img: "/assets/img/inner-service/service/service-3.jpg",
    images: ["/assets/img/inner-service/service/service-3.jpg"],
    categories: ["Restorative Dentistry", "Functional Restoration"],
    tags: ["implants", "titanium", "restoration", "permanent", "tooth replacement"],
    desc: "Permanent tooth replacement solution using titanium implants that integrate with your jawbone.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Dental implants are the gold standard for replacing missing teeth. They provide a permanent, stable foundation for replacement teeth that look, feel, and function like natural teeth.</p>
        </div>
        
        <div class="service-details-content">
          <h4 class="service-details-title">What are Dental Implants?</h4>
          <p class="mb-20">A dental implant is a titanium post that's surgically placed into the jawbone to replace the root of a missing tooth. Once the implant integrates with the bone, it can support a crown, bridge, or denture.</p>
          <p>Implants are the closest thing to natural teeth, providing superior stability and function compared to traditional dentures or bridges.</p>
        </div>
        
        <div class="service-details-benefits">
          <h4 class="service-details-title">Advantages of Dental Implants</h4>
          <div class="row">
            <div class="col-md-6">
              <ul class="benefit-list">
                <li>Permanent solution</li>
                <li>Preserves jawbone</li>
                <li>No impact on adjacent teeth</li>
                <li>Natural appearance and feel</li>
              </ul>
            </div>
            <div class="col-md-6">
              <ul class="benefit-list">
                <li>Improved chewing ability</li>
                <li>Enhanced speech</li>
                <li>Easy maintenance</li>
                <li>High success rate (95%+)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="service-details-process">
          <h4 class="service-details-title">Treatment Timeline</h4>
          <div class="timeline">
            <div class="timeline-item">
              <h5>Phase 1: Consultation & Planning (1-2 weeks)</h5>
              <p>Comprehensive examination, X-rays, and treatment planning</p>
            </div>
            <div class="timeline-item">
              <h5>Phase 2: Implant Placement (1 day)</h5>
              <p>Surgical placement of titanium implant into jawbone</p>
            </div>
            <div class="timeline-item">
              <h5>Phase 3: Healing Period (3-6 months)</h5>
              <p>Osseointegration - implant fuses with bone</p>
            </div>
            <div class="timeline-item">
              <h5>Phase 4: Crown Placement (2-3 weeks)</h5>
              <p>Attachment of abutment and final crown</p>
            </div>
          </div>
        </div>
        
        <div class="service-details-candidacy">
          <h4 class="service-details-title">Am I a Candidate?</h4>
          <p>Good candidates for dental implants have adequate bone density, healthy gums, and good oral hygiene. Age is not a limiting factor, and most adults can receive implants.</p>
        </div>
      `
    },
    author: "Dr. Implant Surgeon",
    isPublished: true,
    blogQuote: false,
    video: true,
    imgSlider: false,
    blogQuoteTwo: false,
    blogHeroSlider: false,
    videoId: "implant-procedure-demo"
  },
  {
    title: "Smile Makeover",
    img: "/assets/img/inner-service/service/service-4.jpg",
    images: ["/assets/img/inner-service/service/service-4.jpg"],
    categories: ["Cosmetic Dentistry", "Comprehensive Treatment"],
    tags: ["makeover", "comprehensive", "transformation", "multiple treatments", "smile design"],
    desc: "Comprehensive smile transformation combining multiple treatments for the perfect aesthetic result.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>A smile makeover is a comprehensive treatment plan that combines multiple cosmetic dental procedures to dramatically improve the appearance of your smile. Each plan is customized to your unique needs and goals.</p>
        </div>
        
        <div class="service-details-content">
          <h4 class="service-details-title">What is a Smile Makeover?</h4>
          <p class="mb-20">A smile makeover involves a combination of cosmetic dental treatments designed to improve the appearance of your smile. The process considers your facial features, skin tone, hair color, and personality to create the perfect smile for you.</p>
          <p>Common procedures include teeth whitening, veneers, crowns, bonding, orthodontics, and gum contouring.</p>
        </div>
        
        <div class="service-details-treatments">
          <h4 class="service-details-title">Common Treatments Included</h4>
          <div class="treatment-grid">
            <div class="treatment-item">
              <h5>Teeth Whitening</h5>
              <p>Professional bleaching for brighter teeth</p>
            </div>
            <div class="treatment-item">
              <h5>Porcelain Veneers</h5>
              <p>Thin shells to cover imperfections</p>
            </div>
            <div class="treatment-item">
              <h5>Dental Crowns</h5>
              <p>Complete tooth restoration</p>
            </div>
            <div class="treatment-item">
              <h5>Orthodontics</h5>
              <p>Alignment correction with braces or clear aligners</p>
            </div>
            <div class="treatment-item">
              <h5>Gum Contouring</h5>
              <p>Reshaping gums for better proportion</p>
            </div>
            <div class="treatment-item">
              <h5>Dental Bonding</h5>
              <p>Repairing minor chips and gaps</p>
            </div>
          </div>
        </div>
        
        <div class="service-details-planning">
          <h4 class="service-details-title">Treatment Planning Process</h4>
          <ol class="planning-steps">
            <li><strong>Comprehensive Consultation:</strong> Detailed examination and discussion of goals</li>
            <li><strong>Digital Smile Design:</strong> Computer modeling of your new smile</li>
            <li><strong>Treatment Sequencing:</strong> Logical order of procedures for optimal results</li>
            <li><strong>Timeline Development:</strong> Realistic schedule for completion</li>
            <li><strong>Cost Planning:</strong> Detailed breakdown of all procedures</li>
          </ol>
        </div>
        
        <div class="service-details-results">
          <h4 class="service-details-title">Expected Results</h4>
          <p>A smile makeover can dramatically improve your appearance, boost confidence, and enhance your quality of life. Results are long-lasting when properly maintained with good oral hygiene and regular dental visits.</p>
        </div>
      `
    },
    author: "Dr. Smile Designer",
    isPublished: true,
    blogQuote: false,
    video: false,
    imgSlider: true,
    blogQuoteTwo: true,
    blogHeroSlider: false,
    videoId: ""
  },
  {
    title: "Zirconium Crowns",
    img: "/assets/img/inner-service/service/service-1.jpg",
    images: ["/assets/img/inner-service/service/service-1.jpg"],
    categories: ["Restorative Dentistry", "Durability & Strength"],
    tags: ["zirconium", "crowns", "durable", "biocompatible", "restoration"],
    desc: "Strong, biocompatible, and aesthetically pleasing crowns made from zirconium oxide material.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Zirconium crowns represent the latest advancement in dental crown technology, offering superior strength, biocompatibility, and natural aesthetics for long-lasting tooth restoration.</p>
        </div>
        
        <div class="service-details-content">
          <h4 class="service-details-title">What are Zirconium Crowns?</h4>
          <p class="mb-20">Zirconium crowns are made from zirconium dioxide, a white crystalline oxide of zirconium. This material is incredibly strong, biocompatible, and can be made to match the exact color of your natural teeth.</p>
          <p>They're considered the premium choice for dental crowns due to their combination of strength, aesthetics, and biocompatibility.</p>
        </div>
        
        <div class="service-details-advantages">
          <h4 class="service-details-title">Advantages of Zirconium</h4>
          <div class="row">
            <div class="col-md-6">
              <ul class="advantage-list">
                <li><strong>Superior Strength:</strong> Extremely durable and fracture-resistant</li>
                <li><strong>Biocompatible:</strong> No allergic reactions or sensitivity</li>
                <li><strong>Aesthetic Excellence:</strong> Natural translucency and color</li>
                <li><strong>Stain Resistant:</strong> Maintains color over time</li>
              </ul>
            </div>
            <div class="col-md-6">
              <ul class="advantage-list">
                <li><strong>Metal-Free:</strong> No dark lines at gum margin</li>
                <li><strong>Thermal Insulation:</strong> Less sensitivity to temperature</li>
                <li><strong>Longevity:</strong> Can last 15+ years with proper care</li>
                <li><strong>Precision Fit:</strong> CAD/CAM technology ensures perfect fit</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="service-details-indications">
          <h4 class="service-details-title">When are Zirconium Crowns Recommended?</h4>
          <ul class="indication-list">
            <li>Severely damaged or decayed teeth</li>
            <li>Teeth with large fillings that need reinforcement</li>
            <li>Discolored teeth that can't be whitened</li>
            <li>Misshapen or irregularly sized teeth</li>
            <li>Teeth requiring root canal treatment</li>
            <li>Replacement of old metal crowns</li>
          </ul>
        </div>
        
        <div class="service-details-procedure">
          <h4 class="service-details-title">Treatment Procedure</h4>
          <div class="procedure-timeline">
            <div class="step">
              <h5>Visit 1: Preparation</h5>
              <p>Tooth preparation, impression taking, and temporary crown placement</p>
            </div>
            <div class="step">
              <h5>Laboratory Phase</h5>
              <p>Custom crown fabrication using CAD/CAM technology (7-10 days)</p>
            </div>
            <div class="step">
              <h5>Visit 2: Delivery</h5>
              <p>Removal of temporary crown and permanent cementation of zirconium crown</p>
            </div>
          </div>
        </div>
        
        <div class="service-details-care">
          <h4 class="service-details-title">Care and Maintenance</h4>
          <p>Zirconium crowns require the same care as natural teeth. Regular brushing, flossing, and dental check-ups will ensure their longevity. Avoid extremely hard foods and grinding habits.</p>
        </div>
      `
    },
    author: "Dr. Crown Specialist",
    isPublished: true,
    blogQuote: false,
    video: false,
    imgSlider: false,
    blogQuoteTwo: false,
    blogHeroSlider: false,
    videoId: ""
  },
  {
    title: "E-Max Crowns",
    img: "/assets/img/inner-service/service/service-2.jpg",
    images: ["/assets/img/inner-service/service/service-2.jpg"],
    categories: ["Cosmetic Dentistry", "Premium Materials"],
    tags: ["e-max", "ceramic", "premium", "aesthetics", "lithium disilicate"],
    desc: "Premium all-ceramic crowns offering exceptional aesthetics and strength for front and back teeth.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>E-Max crowns are made from lithium disilicate glass-ceramic, representing the pinnacle of aesthetic dental restoration. They offer an unmatched combination of beauty, strength, and biocompatibility.</p>
        </div>
        
        <div class="service-details-content">
          <h4 class="service-details-title">What are E-Max Crowns?</h4>
          <p class="mb-20">E-Max crowns are fabricated from a single block of lithium disilicate ceramic, making them incredibly strong and aesthetically superior. The material's unique properties allow for minimal tooth preparation while providing maximum strength.</p>
          <p>They're the preferred choice for patients who want the most natural-looking restoration possible, especially in the front teeth area.</p>
        </div>
        
        <div class="service-details-features">
          <h4 class="service-details-title">Key Features</h4>
          <div class="features-grid">
            <div class="feature-item">
              <h5>Exceptional Aesthetics</h5>
              <p>Unmatched translucency and light transmission mimics natural teeth perfectly</p>
            </div>
            <div class="feature-item">
              <h5>High Strength</h5>
              <p>400 MPa flexural strength - suitable for all areas of the mouth</p>
            </div>
            <div class="feature-item">
              <h5>Minimal Preparation</h5>
              <p>Requires less tooth reduction compared to traditional crowns</p>
            </div>
            <div class="feature-item">
              <h5>Biocompatible</h5>
              <p>100% ceramic material with excellent tissue compatibility</p>
            </div>
            <div class="feature-item">
              <h5>Stain Resistant</h5>
              <p>Non-porous surface resists staining and plaque accumulation</p>
            </div>
            <div class="feature-item">
              <h5>Precise Fit</h5>
              <p>CAD/CAM fabrication ensures perfect marginal adaptation</p>
            </div>
          </div>
        </div>
        
        <div class="service-details-comparison">
          <h4 class="service-details-title">E-Max vs Traditional Crowns</h4>
          <div class="comparison-table">
            <table class="table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>E-Max Crowns</th>
                  <th>Traditional PFM Crowns</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Aesthetics</td>
                  <td>Excellent - Natural translucency</td>
                  <td>Good - Metal shows through</td>
                </tr>
                <tr>
                  <td>Strength</td>
                  <td>Very High (400 MPa)</td>
                  <td>High but less aesthetic</td>
                </tr>
                <tr>
                  <td>Biocompatibility</td>
                  <td>Excellent - 100% ceramic</td>
                  <td>Good - Some metal sensitivity</td>
                </tr>
                <tr>
                  <td>Longevity</td>
                  <td>15+ years</td>
                  <td>10-15 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="service-details-ideal-candidates">
          <h4 class="service-details-title">Ideal Candidates</h4>
          <ul class="candidate-list">
            <li>Patients seeking the most aesthetic result</li>
            <li>Front teeth restorations where appearance is critical</li>
            <li>Patients with metal allergies or sensitivities</li>
            <li>Those wanting minimal tooth preparation</li>
            <li>Patients who grind their teeth (with proper protection)</li>
          </ul>
        </div>
        
        <div class="service-details-process">
          <h4 class="service-details-title">Treatment Process</h4>
          <ol class="process-list">
            <li><strong>Initial Consultation:</strong> Examination and color matching</li>
            <li><strong>Tooth Preparation:</strong> Minimal reduction preserving tooth structure</li>
            <li><strong>Digital Impression:</strong> Precise 3D scanning for perfect fit</li>
            <li><strong>Temporary Crown:</strong> Protection during fabrication period</li>
            <li><strong>Crown Delivery:</strong> Careful fitting and permanent bonding</li>
          </ol>
        </div>
        
        <div class="service-details-aftercare">
          <h4 class="service-details-title">Post-Treatment Care</h4>
          <p>E-Max crowns require regular oral hygiene maintenance. Use a soft-bristled toothbrush, non-abrasive toothpaste, and floss daily. Regular dental check-ups ensure long-term success.</p>
        </div>
      `
    },
    author: "Dr. E-Max Expert",
    isPublished: true,
    blogQuote: true,
    video: false,
    imgSlider: false,
    blogQuoteTwo: true,
    blogHeroSlider: false,
    videoId: ""
  }
];

// Mock authentication token - gerçek uygulamada login yapıp token alınmalı
const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZjMGIyZjMxOGM2ZTEwNzE5ZmU4NmQiLCJpYXQiOjE3MzUzMTcyOTYsImV4cCI6MTczNTQwMzY5Nn0.jN8FvVX7IKW5qFOFrpQKz9_YYDcYqLQ1X_gX4ydVMJE";

const createServicePosts = async () => {
  try {
    console.log('ServicePost\'ları oluşturuluyor...');
    
    for (let i = 0; i < serviceDataPosts.length; i++) {
      const post = serviceDataPosts[i];
      
      try {
        const response = await axios.post(`${server}/service-posts`, post, {
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ "${post.title}" service post'u oluşturuldu (Slug: ${response.data.servicePost.slug})`);
        
        // API rate limiting için kısa bekleme
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        if (error.response) {
          console.error(`❌ "${post.title}" oluşturulamadı:`, error.response.data.message);
        } else {
          console.error(`❌ "${post.title}" oluşturulamadı:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Tüm service post\'lar işlendi!');
    console.log(`📍 Dashboard: http://localhost:3001/dashboard/service-posts`);
    console.log(`📍 Slug örneği: http://localhost:3001/hollywood-smile`);
    
  } catch (error) {
    console.error('Genel hata:', error.message);
  }
};

// Script'i çalıştır
createServicePosts(); 
 
 
 
 