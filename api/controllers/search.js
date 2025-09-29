import { db } from "../db.js";

export const searchContent = (req, res) => {
  const { q, user } = req.query;
  const searchTerm = `%${q || ""}%`;

  let query = `
    SELECT p.id, p.title, p.desc AS content, u.username
    FROM posts p
    JOIN users u ON p.uid = u.id
    WHERE (p.title LIKE ? OR p.desc LIKE ?)
    ${user ? "AND u.username = ?" : ""}
    
    UNION

    SELECT r.id, NULL AS title, r.content, u.username
    FROM replies r
    JOIN users u ON r.uid = u.id
    WHERE r.content LIKE ?
    ${user ? "AND u.username = ?" : ""}
  `;

  const params = user
    ? [searchTerm, searchTerm, user, searchTerm, user]
    : [searchTerm, searchTerm, searchTerm];

  db.query(query, params, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};