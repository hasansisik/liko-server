const mongoose = require("mongoose");
const ServicePost = require("../models/ServicePost");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb+srv://birimajanswordpress:y1KCLbO0lrxufCjH@birimajans.g7sheo6.mongodb.net/birim";
    await mongoose.connect(mongoUrl);
    console.log("MongoDB bağlantısı başarılı");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    process.exit(1);
  }
};

const servicePostsData = [
  {
    title: "Diş İmplantı Tedavisi",
    img: "/assets/img/service/service-1.jpg",
    images: [
      "/assets/img/service/service-detail-1.jpg",
      "/assets/img/service/service-detail-2.jpg"
    ],
    categories: ["Cerrahi", "İmplant"],
    tags: ["implant", "cerrahi", "diş", "tedavi"],
    desc: "Eksik dişlerinizi en doğal görünümle tamamlayın. Modern implant teknolojisi ile kalıcı çözüm.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Diş implantı, eksik dişlerin yerine yerleştirilen titanyum vida şeklindeki yapay diş kökleridir. Bu tedavi, tek diş eksikliğinden tam dişsizliğe kadar her durumda uygulanabilir.</p>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">İmplant Tedavisinin Avantajları</h4>
          <ul>
            <li>Doğal diş görünümü ve hissi</li>
            <li>Komşu dişlere zarar vermez</li>
            <li>Uzun ömürlü çözüm</li>
            <li>Çiğneme fonksiyonunu tam olarak geri kazandırır</li>
          </ul>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Tedavi Süreci</h4>
          <p>İmplant tedavisi genellikle 3-6 ay sürer. İlk aşamada implant yerleştirilir, kemik ile kaynaşması beklenir, ardından üst yapı (crown) takılır.</p>
        </div>
      `
    },
    author: "Dr. Mehmet Özkan",
    videoId: "dQw4w9WgXcQ",
    video: true,
    blogQuote: false,
    imgSlider: true,
    blogQuoteTwo: false,
    blogHeroSlider: false,
    isPublished: true,
    comments: [
      {
        name: "Ayşe Yılmaz",
        avatar: "/assets/img/avatar/avatar-1.jpg",
        date: "15 Şubat 2025",
        comment: "İmplant tedavim mükemmel geçti. Çok memnun kaldım."
      }
    ]
  },
  {
    title: "Ortodonti Tedavisi",
    img: "/assets/img/service/service-2.jpg",
    images: [
      "/assets/img/service/orthodontics-1.jpg",
      "/assets/img/service/orthodontics-2.jpg"
    ],
    categories: ["Ortodonti", "Estetik"],
    tags: ["tel", "braket", "düzeltme", "estetik"],
    desc: "Çarpık ve düzensiz dişlerinizi modern ortodonti yöntemleri ile düzeltin. Metal ve şeffaf braket seçenekleri.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Ortodonti tedavisi, dişlerin ve çenelerin düzgün hizalanması için yapılan tedavidir. Bu tedavi ile hem estetik hem de fonksiyonel sorunlar çözülür.</p>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Ortodonti Tedavi Seçenekleri</h4>
          <ul>
            <li>Metal braketler</li>
            <li>Seramik braketler</li>
            <li>Şeffaf plaklar (Invisalign)</li>
            <li>Lingual braketler</li>
          </ul>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Tedavi Süresi</h4>
          <p>Ortodonti tedavi süresi genellikle 12-24 ay arasında değişir. Bu süre, mevcut durumun karmaşıklığına göre belirlenir.</p>
        </div>
      `
    },
    author: "Dr. Elif Kaya",
    isPublished: true,
    comments: []
  },
  {
    title: "Diş Beyazlatma",
    img: "/assets/img/service/service-3.jpg",
    images: [
      "/assets/img/service/whitening-1.jpg"
    ],
    categories: ["Estetik", "Kozmetik"],
    tags: ["beyazlatma", "estetik", "gülüş", "kozmetik"],
    desc: "Gülüşünüzü güzelleştirin. Profesyonel diş beyazlatma ile dişlerinizi 3-8 ton beyazlatabilirsiniz.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Diş beyazlatma, dişlerin rengini açmak için yapılan kozmetik diş hekimliği uygulamasıdır. Güvenli ve etkili yöntemlerle yapılır.</p>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Beyazlatma Türleri</h4>
          <ul>
            <li>Ofis tipi beyazlatma (Zoom, laser)</li>
            <li>Ev tipi beyazlatma</li>
            <li>Kombinasyon tedavi</li>
          </ul>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Sonuçlar</h4>
          <p>Tek seansta 3-8 ton beyazlatma mümkündür. Sonuçlar 1-3 yıl kalıcıdır.</p>
        </div>
      `
    },
    author: "Dr. Can Demir",
    blogQuote: true,
    isPublished: true,
    comments: [
      {
        name: "Murat Şen",
        avatar: "/assets/img/avatar/avatar-2.jpg",
        date: "10 Şubat 2025",
        comment: "Beyazlatma sonrası dişlerim çok güzel görünüyor!"
      }
    ]
  },
  {
    title: "Kanal Tedavisi",
    img: "/assets/img/service/service-4.jpg",
    images: [],
    categories: ["Endodonti", "Tedavi"],
    tags: ["kanal", "endodonti", "ağrı", "tedavi"],
    desc: "Dişinizdeki enfeksiyonu tedavi edin. Modern kanal tedavisi yöntemleri ile ağrısız ve başarılı sonuçlar.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Kanal tedavisi, diş pulpasındaki enfeksiyon veya hasarı tedavi etmek için yapılan işlemdir. Bu tedavi ile diş çekimi önlenir.</p>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Ne Zaman Gerekir?</h4>
          <ul>
            <li>Şiddetli diş ağrısı</li>
            <li>Soğuk ve sıcağa hassasiyet</li>
            <li>Diş etinde şişlik</li>
            <li>Dişte çatlak veya kırık</li>
          </ul>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Tedavi Süreci</h4>
          <p>Kanal tedavisi genellikle 1-3 seansta tamamlanır. Modern tekniklerle ağrısız bir şekilde yapılır.</p>
        </div>
      `
    },
    author: "Dr. Zeynep Aktaş",
    isPublished: false,
    comments: []
  },
  {
    title: "Porselen Veneer",
    img: "/assets/img/service/service-5.jpg",
    images: [
      "/assets/img/service/veneer-1.jpg",
      "/assets/img/service/veneer-2.jpg",
      "/assets/img/service/veneer-3.jpg"
    ],
    categories: ["Estetik", "Protez"],
    tags: ["veneer", "porselen", "estetik", "gülüş"],
    desc: "Mükemmel gülüş tasarımı için porselen veneer. Dişlerinizin şeklini, rengini ve boyutunu ideal hale getirin.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Porselen veneer, dişlerin ön yüzeyine yapıştırılan ince porselen kaplamalar ile estetik problemlerin çözüldüğü tedavi yöntemidir.</p>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Hangi Durumlarda Uygulanır?</h4>
          <ul>
            <li>Renk değişikliği olan dişler</li>
            <li>Çarpık veya aralıklı dişler</li>
            <li>Kırık veya aşınmış dişler</li>
            <li>Şekil bozukluğu olan dişler</li>
          </ul>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Avantajları</h4>
          <p>Doğal diş görünümü, leke yapmaz, uzun ömürlü, minimal diş kesimi gerektirir.</p>
        </div>
      `
    },
    author: "Dr. Ahmet Yıldız",
    imgSlider: true,
    blogQuoteTwo: true,
    isPublished: true,
    comments: [
      {
        name: "Seda Öz",
        avatar: "/assets/img/avatar/avatar-3.jpg",
        date: "8 Şubat 2025",
        comment: "Veneer tedavim harika oldu. Artık çok güzel gülümsüyorum."
      },
      {
        name: "Burak Kara",
        avatar: "/assets/img/avatar/avatar-4.jpg",
        date: "12 Şubat 2025",
        comment: "Sonuçlar beklentilerimi aştı. Teşekkürler."
      }
    ]
  },
  {
    title: "Periodontal Tedavi",
    img: "/assets/img/service/service-6.jpg",
    images: [],
    categories: ["Periodontoloji", "Tedavi"],
    tags: ["diş eti", "periodontal", "gingivitis", "tedavi"],
    desc: "Diş eti hastalıklarını tedavi edin. Gingivitis ve periodontitis için etkili çözümler.",
    content: {
      htmlContent: `
        <div class="service-details-top-text">
          <p>Periodontal tedavi, diş etlerini ve diş çevresindeki dokuları etkileyen hastalıkların tedavisidir. Erken müdahale ile ciddi problemler önlenebilir.</p>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Diş Eti Hastalığının Belirtileri</h4>
          <ul>
            <li>Diş etlerinde kanama</li>
            <li>Şişlik ve kızarıklık</li>
            <li>Ağız kokusu</li>
            <li>Diş etlerinde çekilme</li>
          </ul>
        </div>
        
        <div class="service-details-section">
          <h4 class="service-details-title">Tedavi Yöntemleri</h4>
          <p>Tartar temizliği, kök düzleştirme, cerrahi işlemler ve düzenli takip ile tedavi edilir.</p>
        </div>
      `
    },
    author: "Dr. Fatma Çelik",
    isPublished: true,
    comments: []
  }
];

const seedServicePosts = async () => {
  try {
    // Clear existing service posts
    await ServicePost.deleteMany({});
    console.log("Mevcut service postlar silindi");

    // Insert service posts one by one to trigger pre-save middleware
    for (let i = 0; i < servicePostsData.length; i++) {
      const postData = {
        ...servicePostsData[i],
        commentCount: servicePostsData[i].comments ? servicePostsData[i].comments.length : 0
      };
      
      const servicePost = new ServicePost(postData);
      await servicePost.save();
      console.log(`Service post "${servicePost.title}" eklendi (slug: ${servicePost.slug})`);
    }

    console.log("Service post seed işlemi başarıyla tamamlandı!");
  } catch (error) {
    console.error("Service post seed hatası:", error);
  }
};

const main = async () => {
  await connectDB();
  await seedServicePosts();
  await mongoose.connection.close();
  console.log("MongoDB bağlantısı kapatıldı");
};

if (require.main === module) {
  main();
}

module.exports = { seedServicePosts }; 
 
 
 
 