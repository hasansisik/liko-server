require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const BlogPost = require("../models/BlogPost");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB bağlantısı başarılı");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    process.exit(1);
  }
};

// Blog data from the provided blog-data.ts
const blogData = [
  {
    title: "Design To Remember",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-1.jpg",
    date: '01 DEC, 2023',
    categories: ['Marketing', 'Design'],
    tags: ['design', 'marketing', 'branding'],
    author: 'John Doe',
    desc: 'Exploring the fundamentals of memorable design that creates lasting impressions and drives business success.',
    commentCount: 3,
    content: {
      htmlContent: `
        <div class="blog-details-top-text">
          <p>The metaverse can be viewed as an evolution of today's internet, which in turn evolved from passive media that we simply consumed. In the age of radio and television, the consumer's only job was to listen and decide if they wanted to buy.</p>
        </div>
        
        <div class="blog-details-left-content">
          <h4 class="blog-details-left-title">What Makes Design Memorable?</h4>
          <p class="mb-20">Design to Remember is simply more than just aesthetics. It's about creating emotional connections with your audience through thoughtful visual storytelling and strategic brand positioning.</p>
          <p>It has survived not only five centuries, but also the leap into digital design, remaining essentially unchanged in its core principles.</p>
        </div>
      `
    }
  },
  {
    title: "Simplistic photo setup",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-2.jpg",
    date: '09. MAY. 2023',
    categories: ['Photography', 'Creativity'],
    tags: ['photography', 'minimalism', 'creative'],
    author: 'John Doe',
    desc: 'Learn how to create stunning photographs with minimal equipment and maximum creativity.',
    commentCount: 2,
    content: {
      htmlContent: `
        <div class="blog-details-top-text">
          <p>Photography doesn't always require expensive equipment. Sometimes the most powerful images come from the simplest setups and creative vision.</p>
        </div>
        
        <div class="blog-details-left-content">
          <h4 class="blog-details-left-title">Minimalist Photography Principles</h4>
          <p class="mb-20">Simplistic photo setup is about understanding light, composition, and timing. These three elements are more important than any expensive camera gear you might own.</p>
          <p>The best photographers know that limitations often breed creativity and force you to think outside the box.</p>
        </div>
      `
    }
  },
  {
    title: "Future Business Ideas",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-3.jpg",
    date: '20. NOV. 2023',
    categories: ['Business', 'Technology'],
    tags: ['business', 'innovation', 'future', 'technology'],
    author: 'John Doe',
    desc: 'Discover innovative business concepts that will shape the future of entrepreneurship and commerce.',
    commentCount: 1,
    content: {
      htmlContent: `
        <div class="blog-details-top-text">
          <p>The business landscape is evolving rapidly with new technologies and changing consumer behaviors. Understanding these trends is crucial for future success.</p>
        </div>
        <div class="blog-details-left-content">
          <h4 class="blog-details-left-title">Emerging Technologies in Business</h4>
          <p>Future Business Ideas are rooted in understanding emerging technologies like AI, blockchain, and IoT. These technologies are reshaping how we think about commerce and customer relationships.</p>
        </div>
      `
    }
  },
  {
    title: "Is It Time To Rebrand?",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-4.jpg",
    date: '30. AUG. 2023',
    categories: ['Branding', 'Marketing'],
    tags: ['branding', 'marketing', 'rebrand', 'strategy'],
    author: 'John Doe',
    desc: 'Signs that indicate your business might need a rebranding strategy and how to approach it effectively.',
    commentCount: 3,
    content: {
      htmlContent: `
        <div class="blog-details-top-text">
          <p>Rebranding is a significant decision that can revitalize your business or confuse your customers. Knowing when and how to rebrand is crucial for long-term success.</p>
        </div>
        <div class="blog-details-left-content">
          <h4 class="blog-details-left-title">Signs You Need to Rebrand</h4>
          <p>Is It Time To Rebrand? This question often arises when businesses face declining sales, outdated visual identity, or expansion into new markets. Recognizing these signs early can save your business.</p>
        </div>
      `
    }
  },
  {
    title: "Desert Treasure Hunt",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-5.jpg",
    date: '09. MAY. 2023',
    categories: ['Adventure'],
    tags: ['adventure', 'travel', 'exploration'],
    author: 'John Doe',
    desc: 'An exciting journey through the desert landscape in search of hidden treasures and unforgettable experiences.',
    video: true,
    videoId: 'rVHxkxJM3rY',
    commentCount: 5,
    content: {
      htmlContent: `
        <div class="blog-details-top-text">
          <p>Adventure awaits in the vast desert landscapes where ancient treasures and modern discoveries intersect in the most unexpected ways.</p>
        </div>
        <div class="blog-details-left-content">
          <h4 class="blog-details-left-title">Planning Your Desert Adventure</h4>
          <p>Desert Treasure Hunt requires careful planning and preparation. Understanding the terrain, weather conditions, and safety protocols is essential for a successful expedition.</p>
        </div>
      `
    }
  },
  {
    title: "Visualizing Your Brand",
    img: "/assets/img/inner-blog/blog-right-sidebar/blog-2.jpg",
    date: '12. JAN. 2023',
    categories: ['Branding', 'Design'],
    tags: ['branding', 'design', 'visual', 'identity'],
    author: 'John Doe',
    desc: 'Transform your brand identity through powerful visual storytelling and strategic design choices.',
    commentCount: 3,
    content: {
      htmlContent: `
        <div class="blog-details-top-text">
          <p>Visual branding goes beyond logos and colors. It's about creating a cohesive visual language that communicates your brand's values and personality.</p>
        </div>
        <div class="blog-details-left-content">
          <h4 class="blog-details-left-title">The Power of Visual Identity</h4>
          <p>Visualizing Your Brand starts with understanding how visual elements influence perception. Colors, typography, and imagery work together to create emotional connections with your audience.</p>
        </div>
      `
    }
  }
];

// Categories to create
const categories = [
  { name: 'Marketing', description: 'Digital marketing, social media, and advertising strategies', color: '#3B82F6' },
  { name: 'Photography', description: 'Photography techniques, equipment, and creative inspiration', color: '#8B5CF6' },
  { name: 'Business', description: 'Business development, entrepreneurship, and industry insights', color: '#10B981' },
  { name: 'Branding', description: 'Brand identity, visual design, and brand strategy', color: '#F59E0B' },
  { name: 'Adventure', description: 'Travel, exploration, and outdoor adventures', color: '#EF4444' },
  { name: 'Design', description: 'UI/UX design, creative processes, and design thinking', color: '#6366F1' },
  { name: 'Technology', description: 'Tech trends, software development, and innovation', color: '#06B6D4' },
  { name: 'Creativity', description: 'Creative processes, inspiration, and artistic expression', color: '#EC4899' }
];

const seedData = async () => {
  try {
    console.log("Veritabanı temizleniyor...");
    await Category.deleteMany({});
    await BlogPost.deleteMany({});
    
    console.log("Kategoriler oluşturuluyor...");
    const createdCategories = [];
    for (const cat of categories) {
      const category = new Category({
        ...cat,
        companyId: "default"
      });
      await category.save();
      createdCategories.push(category);
    }
    
    console.log("Blog yazıları oluşturuluyor...");
    const createdPosts = [];
    for (const post of blogData) {
      const blogPost = new BlogPost({
        ...post,
        companyId: "default",
        isPublished: true,
        isActive: true,
        comments: []
      });
      await blogPost.save();
      createdPosts.push(blogPost);
    }
    
    // Update category post counts
    for (let category of createdCategories) {
      const postCount = await BlogPost.countDocuments({ 
        categories: { $in: [category.name] },
        companyId: "default" 
      });
      category.postCount = postCount;
      await category.save();
    }
    
    console.log(`✅ ${createdCategories.length} kategori oluşturuldu`);
    console.log(`✅ ${createdPosts.length} blog yazısı oluşturuldu`);
    console.log("📊 Kategori post sayıları güncellendi");
    
    console.log("\nOluşturulan kategoriler:");
    createdCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug}) - ${cat.postCount} yazı`);
    });
    
    console.log("\nOluşturulan blog yazıları:");
    createdPosts.forEach(post => {
      console.log(`- ${post.title} (${post.slug}) - ${post.categories.join(', ')}`);
    });
    
  } catch (error) {
    console.error("Seed işlemi sırasında hata:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nVeritabanı bağlantısı kapatıldı");
  }
};

const run = async () => {
  await connectDB();
  await seedData();
};

run(); 