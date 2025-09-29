import express from "express";
import { getCategories, addCategory, deleteCategory } from "../controllers/category.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.delete("/:id", isAdmin, deleteCategory)

export default router;
