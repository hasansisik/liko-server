const mongoose = require("mongoose");

const LogoSchema = new mongoose.Schema({
  default: { type: String, required: true },
  dark: { type: String, required: true },
  sticky: { type: String, required: true },
  alt: { type: String, required: true },
  dimensions: {
    default: {
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    sticky: {
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    }
  }
});

const SubMenuSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true }
});

const MenuSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  hasDropdown: { type: Boolean, required: true },
  subMenus: [SubMenuSchema]
});

const NavigationSchema = new mongoose.Schema({
  menus: [MenuSchema],
  cta: {
    text: { type: String, required: true },
    action: { type: String, required: true }
  }
});

const MobileSchema = new mongoose.Schema({
  hamburgerIcon: {
    lines: { type: Number, required: true },
    animation: { type: Boolean, required: true }
  },
  offcanvas: {
    logo: {
      src: { type: String, required: false },
      alt: { type: String, required: false },
      width: { type: Number, required: false },
      height: { type: Number, required: false }
    },
    information: {
      title: { type: String, required: false },
      phone: {
        text: { type: String, required: false },
        number: { type: String, required: false }
      },
      email: {
        text: { type: String, required: false },
        address: { type: String, required: false }
      },
      address: {
        text: { type: String, required: false },
        link: { type: String, required: false }
      }
    },
    socialMedia: {
      title: { type: String, required: false },
      links: [
        {
          platform: { type: String, required: false },
          url: { type: String, required: false },
          icon: { type: String, required: false }
        }
      ]
    }
  }
});

const DialogSchema = new mongoose.Schema({
  enabled: { type: Boolean, required: true },
  backdrop: {
    backgroundColor: { type: String, required: true },
    closeOnClick: { type: Boolean, required: true }
  },
  closeButton: {
    text: { type: String, required: true },
    size: { type: String, required: true },
    position: {
      top: { type: String, required: true },
      right: { type: String, required: true }
    }
  }
});

const StylingSchema = new mongoose.Schema({
  container: {
    padding: { type: String, required: true },
    maxWidth: { type: String, required: true }
  },
  header: {
    padding: { type: String, required: true },
    transition: { type: String, required: true },
    stickyBackground: { type: String, required: true },
    transparentBackground: { type: String, required: true },
    boxShadow: {
      default: { type: String, required: true },
      sticky: { type: String, required: true }
    }
  },
  colors: {
    hamburger: {
      default: { type: String, required: true },
      black: { type: String, required: true },
      white: { type: String, required: true },
      sticky: { type: String, required: true }
    }
  }
});

const HeaderSchema = new mongoose.Schema(
  {
    logo: LogoSchema,
    navigation: NavigationSchema,
    mobile: MobileSchema,
    dialog: DialogSchema,
    styling: StylingSchema,
    companyId: {
      type: String,
      required: true,
      default: "default"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Header = mongoose.model("Header", HeaderSchema);
module.exports = Header; 