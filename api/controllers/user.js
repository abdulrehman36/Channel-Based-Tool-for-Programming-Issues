import jwt from "jsonwebtoken";
import { db } from "../db.js";


export const deleteUser = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not Authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // Only allow if admin
    if (userInfo.username !== "admin") {
      return res.status(403).json("Only admin can delete users.");
    }

    const userId = req.params.id;
    const q = "DELETE FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("✅ User deleted by admin.");
    });
  });
};

export const getAllUsers = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not Authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // Only allow admin to see all users
    if (userInfo.username !== "admin") {
      return res.status(403).json("Only admin can view users.");
    }

    const q = "SELECT id, username, email FROM users";
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getPostRanking = (req, res) => {
  const q = `
    SELECT u.username, COUNT(p.id) AS post_count
    FROM users u
    LEFT JOIN posts p ON u.id = p.uid
    GROUP BY u.id
    ORDER BY post_count DESC
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getReplyRanking = (req, res) => {
  const q = `
    SELECT u.username,
      IFNULL(SUM(r.thumbs_up), 0) - IFNULL(SUM(r.thumbs_down), 0) AS score
    FROM users u
    LEFT JOIN replies r ON u.id = r.uid
    GROUP BY u.id
    ORDER BY score DESC
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};