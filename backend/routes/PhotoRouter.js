const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imageDri = path.join(__dirname, "../images");
if (!fs.existsSync(imageDri)) {
  fs.mkdirSync(imageDri);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDri);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

router.get("/photosOfUser/:id", async (req, res) => {
  try {
    const User = require("../db/userModel");
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ error: "User not found" });
    const photos = await Photo.find({ user_id: req.params.id });
    const result = await Promise.all(
      photos.map(async (photo) => {
        const comments = await Promise.all(
          (photo.comments || []).map(async (comment) => {
            const commentUser = await User.findById(
              comment.user_id,
              "_id first_name last_name"
            );
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user: commentUser
                ? {
                    _id: commentUser._id,
                    first_name: commentUser.first_name,
                    last_name: commentUser.last_name,
                  }
                : null,
            };
          })
        );
        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments,
        };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(400).send({ error: "Invalid user id" });
  }
});
router.post("/commentsOfPhoto/:id", async (req, res) => {
  const { comment, user_id } = req.body;
  try {
    const photo = await Photo.findById(req.params.id);
    const newComment = {
      comment,
      user_id,
      date_time: new Date(),
    };
    photo.comments = photo.comments || [];
    photo.comments.push(newComment);
    await photo.save();
    res.json(photo.comments);
  } catch (err) {
    res.status(400).send({ error: "Internal error" });
  }
});

module.exports = router;
