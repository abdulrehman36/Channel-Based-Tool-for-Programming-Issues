import { db } from "../db.js";
import jwt from "jsonwebtoken";

// update SELECT query to use 'channels'
export const getCategories = (req, res) => {
  const q = "SELECT * FROM channels"; // ← fixed!
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//  update INSERT query to use 'channels'
export const addCategory = (req, res) => {
  const q = "INSERT INTO channels (`name`) VALUES (?)"; 
  db.query(q, [req.body.name], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Channel added");
  });
};

export const deleteCategory = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not Authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    if (userInfo.username !== "admin") {
      return res.status(403).json("Only admin can delete channels.");
    }

    const channelId = req.params.id;
    const q = "DELETE FROM channels WHERE id = ?";

    db.query(q, [channelId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("✅ Channel deleted by admin.");
    });
  });
};