import express from "express"
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { voteOnPost } from "../controllers/post.js";
import { verifyToken } from "../middleware/verifyToken.js";



const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);
router.delete("/:id", isAdmin, deletePost);
router.post("/vote", verifyToken, voteOnPost);


export default router;