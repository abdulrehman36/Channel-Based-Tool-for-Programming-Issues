import express from "express"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import cors from "cors";
import cookieParser from "cookie-parser"
import multer from "multer";
import categoryRoutes from "./routes/category.js";
import replyRoutes from "./routes/replies.js";
import searchRoutes from "./routes/search.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true               
}));

app.use(express.json())
app.use("/upload", express.static(path.join(__dirname, "public/upload")));
app.use(cookieParser())
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'upload'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage })



app.post('/api/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);

})
app.use("/api/posts", postRoutes)
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/search", searchRoutes); 


app.listen(3000, () => {
  console.log("Connected")
})