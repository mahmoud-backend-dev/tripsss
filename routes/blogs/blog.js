const express = require('express');
const path = require('path');
const fs = require("fs")
const client = require("../../db/db");
const photoUpload = require("../../utils/uploadimage.js");
const { cloadinaryUploadImage, cloadinaryRemoveImage } = require("../../utils/uploadimageCdn.js");
const validateBlog = require('../../models/blog.js');
const isAdmin = require('../../middleware/isAdmin.js');

const router = express.Router();

const insertBlog = async (description, date, imagePath) => {
  try {
    const uploadResult = await cloadinaryUploadImage(imagePath);
    const { public_id, secure_url } = uploadResult;

    await client.query("CALL insert_image($1,$2)", [public_id, secure_url]);
    await client.query("CALL insert_blog($1,$2,$3)", [public_id, description, date]);

    return { msg: "Blog inserted successfully" };
  } catch (error) {
    throw error;
  }
};

router.post("/", isAdmin, photoUpload.single("image"), async (req, res) => {
  try {
    const { error } = validateBlog(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const { description, date } = req.body;
    const imagePath = path.join(__dirname, `../../images/${req.file.filename}`);

    const insertResult = await insertBlog(description, date, imagePath);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      }
    });
    return res.json(insertResult);
    
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const { rows } = await client.query("SELECT * FROM get_blogs();");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ msg: "Internal server error." });
  }
});

router.delete("/:id", async (req, res) => {
    try {
        let image_id = req.params.id;
      await client.query("CALL delete_blog($1);", [image_id]);
      await cloadinaryRemoveImage(image_id);
      res.json({ msg: "Blog and associated image deleted successfully" });
    } catch (error) {
      res.status(500).json({ msg: "Internal server error." });
    }
  });
  

module.exports = router;