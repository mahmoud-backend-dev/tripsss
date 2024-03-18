const express = require("express");
const path = require("path");
const fs = require("fs");
const client = require("../../db/db");
const photoUpload = require("../../utils/uploadimage.js");
const {
  cloadinaryUploadImage,
  cloadinaryRemoveImage,
} = require("../../utils/uploadimageCdn.js");
const validateTrip = require("../../models/trip.js");
const isAdmin = require("../../middleware/isAdmin.js");

const router = express.Router();

router.post("/", isAdmin, photoUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "You must send an image" });
    }

    const imagePath = path.join(__dirname, `../../images/${req.file.filename}`);
    const uploadResult = await cloadinaryUploadImage(imagePath);
    const { public_id, secure_url } = uploadResult;

    const { error } = validateTrip(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const { price, name, duration, vehicle, gudinjg, description ,type } = req.body;
    await client.query("CALL insert_trip($1, $2, $3, $4,$5,$6,$7,$8,$9);", [
      public_id,
      price,
      vehicle,
      name,
      gudinjg,
      duration,
      description,
      secure_url,
      type
    ]);
    res.json({ msg: "One tripe Inserted " });
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      }
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.put("/:id", isAdmin, async (req, res) => {
  try {
    const { error } = validateTrip(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    const id = req.params.id;
    const { price, name, duration, vehicle, gudinjg, description } = req.body;

    // Update the trip in the database
    const result = await client.query(
      "SELECT update_trip($1, $2, $3, $4, $5, $6, $7)",
      [id, price, vehicle, name, gudinjg, duration, description]
    );

    // Check if the trip was successfully updated
    if (result.rows[0].update_trip !== null) {
      return res.json({ msg: "Trip updated successfully" });
    } else {
      return res.status(404).json({ msg: "Trip not found" });
    }
  } catch (error) {
    console.error("Update trip error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/trip/:id", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM get_trip($1);", [
      req.params.id,
    ]);
    const trips = result.rows;
    res.json({ trips });
  } catch (error) {
    console.error("Error fetching all trips:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

/// not used

router.get("/search/:searchKey", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM search($1);", [
      req.params.searchKey,
    ]);
    const trips = result.rows;
    res.json({ trips });
  } catch (error) {
    console.error("Error fetching all trips:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM get_trips();");
    const trips = result.rows;
    res.json({ trips });
  } catch (error) {
    console.error("Error fetching all trips:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/all/:typeid", async (req, res) => {
  try {
    let type = req.params.typeid;
    const result = await client.query("SELECT * FROM get_trips_type($1);",[type]);
    const trips = result.rows;
    res.json({ trips });
  } catch (error) {
    console.error("Error fetching all trips:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});


router.get("/names", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM trips_names();");
    const trips = result.rows;
    res.json({ trips });
  } catch (error) {
    console.error("Error fetching all trips:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/random4", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM get_4_trips();");
    const trips = result.rows;
    res.json({ trips });
  } catch (error) {
    console.error("Error fetching random 4 trips:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/random3", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM get_3_trips();");
    const trips = result.rows;
    res.json({ trips });
  } catch (error) {
    console.error("Error fetching random 3 trips:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.delete("/trip/:id", isAdmin, async (req, res) => {
  try {
    await client.query("CALL delete_trip($1);", [req.params.id]);
    res.json({ msg: "done" });
  } catch (error) {
    console.error("Error fetching all trips:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/images/:id", async (req, res) => {
  try {
    let trip_id = req.params.id;
    let result = await client.query("SELECT * FROM get_images($1);", [trip_id]);
    res.json(result.rows); // Return only the rows
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.delete("/images/:id", async (req, res) => {
  try {
    let img_id = req.params.id;
    await client.query("CALL delete_image($1);", [img_id]);
    res.json({ msg: "Image deleted successfully" }); // Return success message
    await cloadinaryRemoveImage(img_id);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/include/:id", async (req, res) => {
  try {
    let trip_id = req.params.id;
    let result = await client.query("SELECT * FROM get_includes($1);", [
      trip_id,
    ]);
    res.json(result.rows); // Return only the rows
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.delete("/include/:id", async (req, res) => {
  try {
    let include_id = req.params.id;
    await client.query("CALL deleteinclude($1);", [include_id]);
    res.json({ msg: "Include deleted successfully" }); // Return success message
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
