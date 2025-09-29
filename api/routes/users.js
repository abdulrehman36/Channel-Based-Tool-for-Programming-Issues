import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { deleteUser, getAllUsers} from "../controllers/user.js";
import { getPostRanking, getReplyRanking } from "../controllers/user.js";
const router = express.Router();
// GET all users (admin only)
router.get("/", isAdmin, getAllUsers);
// DELETE user by ID — admin only
router.delete("/:id", isAdmin, deleteUser);
router.get("/ranking/posts", getPostRanking);
router.get("/ranking/replies", getReplyRanking);

export default router;
