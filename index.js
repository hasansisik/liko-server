require("dotenv").config();
require("express-async-errors");
//express
const cors = require("cors");
const express = require("express");
const app = express();

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow any origin that matches your IP address with any port
    if (!origin || origin.startsWith('http://192.168.1.58:') || origin === 'http://localhost:3000' || origin === 'https://aver-nextjs-tau.vercel.app') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//database
const connectDB = require("./config/connectDB");

//routers
const authRouter = require("./routers/auth");
const aboutRouter = require("./routers/about");
const contactRouter = require("./routers/contact");
const serviceRouter = require("./routers/service");
const blogRouter = require("./routers/blog");
const blogPostsRouter = require("./routers/blogPosts");
const servicePostsRouter = require("./routers/servicePosts");
const categoriesRouter = require("./routers/categories");
const homeRouter = require("./routers/home");
const headerRouter = require("./routers/header");
const footerRouter = require("./routers/footer");
const formRouter = require("./routers/form");
const formSubmissionRouter = require("./routers/formSubmission");
const policyRouter = require("./routers/policy");
const seoRouter = require("./routers/seo");

//midlleware
const notFoundMiddleware = require("./middleware/not-found");
const erorHandlerMiddleware = require("./middleware/eror-handler");

//app
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.use(express.urlencoded({ extended: true }));

app.use("/v1/auth", authRouter);
app.use("/v1/about", aboutRouter);
app.use("/v1/contact", contactRouter);
app.use("/v1/service", serviceRouter);
app.use("/v1/blog", blogRouter);
app.use("/v1/blog-posts", blogPostsRouter);
app.use("/v1/service-posts", servicePostsRouter);
app.use("/v1/categories", categoriesRouter);
app.use("/v1/home", homeRouter);
app.use("/v1/header", headerRouter);
app.use("/v1/footer", footerRouter);
app.use("/v1/form", formRouter);
app.use("/v1/form-submissions", formSubmissionRouter);
app.use("/v1/policies", policyRouter);
app.use("/v1/seo", seoRouter);

app.use(notFoundMiddleware);
app.use(erorHandlerMiddleware);

const port = process.env.PORT || 3040;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(
      port,
      console.log(
        `MongoDb Connection Successful,App started on port ${port} : ${process.env.NODE_ENV}`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

start();