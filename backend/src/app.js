const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const classRoutes = require("./routes/classRoutes");

const app = express();

/* =========================================
   BODY PARSER
========================================= */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================================
   SECURITY MIDDLEWARE
========================================= */
// Secure HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow serving images/pdfs
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "http://localhost:5002"],
        // ✅ Allow the frontend (localhost:3000) to put backend content in an iframe
        frameAncestors: ["'self'", "http://localhost:3000"],
      },
    },
  })
);

// Enable CORS for frontend
// CORS middleware
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

// Sanitize request data to prevent NoSQL injection
// app.use(mongoSanitize());

// Rate Limiting (prevent brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests per window per IP
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);



// Prevent XSS attacks
// app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());

/* =========================================
   LOGGING (Development Only)
========================================= */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* =========================================
   STATIC FOLDER (for file uploads)
========================================= */
// We add 'setHeaders' to force the browser to display PDF/Images instead of downloading
app.use("/uploads", express.static(path.join(__dirname, "../uploads"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".pdf")) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline"); // 'inline' = Preview, 'attachment' = Download
    }
    else if (filePath.match(/\.(jpg|jpeg|png|gif)$/)) {
      res.setHeader("Content-Disposition", "inline");
    }
  }
}));

/* =========================================
   API ROUTES (Versioned)
========================================= */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/classes", classRoutes);

/* =========================================
   HEALTH CHECK ROUTE
========================================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running 🚀",
  });
});

/* =========================================
   ERROR HANDLING
========================================= */
// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;