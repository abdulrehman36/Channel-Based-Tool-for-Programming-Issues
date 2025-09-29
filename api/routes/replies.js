import express from "express";
import { addReply, getRepliesByPost, voteOnReply } from "../controllers/reply.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { deleteReply, markAsAccepted } from "../controllers/reply.js";
import { isAdmin } from "../middleware/isAdmin.js";



const router = express.Router();

router.post("/", addReply);


// Add this route below your POST
router.get("/:post_id", getRepliesByPost);
router.post("/vote", verifyToken, voteOnReply);
router.post("/vote", voteOnReply);
router.delete("/:id", verifyToken, isAdmin, deleteReply);
router.post("/accept", markAsAccepted);
export default router;