import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.js"; // מסלול ההעלאה

const app = express();

// אפשר CORS
app.use(cors());

// ❗ אל תפעיל express.json לפני Multer במסלולים שמקבלים קבצים!
// לכן את JSON אנחנו מפעילים רק *אחרי* נתיבי ההעלאה.

/* ============================
   UPLOAD ROUTES (MULTER)
============================ */
app.use("/upload", uploadRoutes);

/* ============================
   JSON ROUTES (AFTER MULTER)
============================ */
app.use(express.json());

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING 🚀");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
