import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const addReply = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Invalid token");

        const { post_id, content, parent_reply_id, img } = req.body;

        const q = `
        INSERT INTO replies (post_id, uid, content, parent_reply_id, img)
        VALUES (?, ?, ?, ?, ?)
      `;

        db.query(q, [post_id, userInfo.id, content, parent_reply_id || null, img || null], (err, result) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("✅ Reply posted.");
        });
    });
};

export const getRepliesByPost = (req, res) => {
    const postId = req.params.post_id;

    const q = `
  SELECT 
  r.*, 
  u.username,
  (SELECT COUNT(*) FROM posts WHERE uid = u.id) AS post_count,
  (SELECT IFNULL(SUM(r2.thumbs_up), 0) - IFNULL(SUM(r2.thumbs_down), 0) 
   FROM replies r2 WHERE r2.uid = u.id) AS score,
  p.uid AS post_owner
FROM replies r
JOIN users u ON r.uid = u.id
JOIN posts p ON r.post_id = p.id
WHERE r.post_id = ?
ORDER BY r.created_at ASC
`;

    db.query(q, [postId], (err, data) => {
        if (err) return res.status(500).json(err);

        // Build nested reply tree
        const replyMap = {};
        const topLevelReplies = [];

        data.forEach(reply => {
            reply.children = [];
            replyMap[reply.id] = reply;

            if (reply.parent_reply_id === null) {
                topLevelReplies.push(reply);
            } else {
                const parent = replyMap[reply.parent_reply_id];
                if (parent) {
                    parent.children.push(reply);
                } else {
                    // In rare cases where parent hasn't been processed yet
                    replyMap[reply.parent_reply_id] = { children: [reply] };
                }
            }
        });

        return res.status(200).json(topLevelReplies);
    });
};

export const voteOnReply = (req, res) => {
    const { reply_id, vote_type } = req.body;

    const column = vote_type === "up" ? "thumbs_up" : "thumbs_down";
    const q = `UPDATE replies SET ${column} = ${column} + 1 WHERE id = ?`;

    db.query(q, [reply_id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Vote recorded 👍👎");
    });
};

export const deleteReply = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Invalid token");

        // ✅ Only allow admin to delete replies
        if (userInfo.username !== "admin") {
            return res.status(403).json("Only admin can delete replies.");
        }

        const replyId = req.params.id;
        const q = "DELETE FROM replies WHERE id = ?";

        db.query(q, [replyId], (err, result) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("✅ Reply deleted.");
        });
    });
};

export const markAsAccepted = (req, res) => {
    const { reply_id } = req.body;

    const q = `
      UPDATE replies 
      SET is_accepted = 1 
      WHERE id = ?
    `;

    db.query(q, [reply_id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("✅ Reply marked as accepted.");
    });
};
