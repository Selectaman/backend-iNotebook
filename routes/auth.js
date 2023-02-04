const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Kisspog";

//create a user using post end point /
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success= false;
        return res.status(404).json({success ,error:"User already exist with this email"});
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      return res.json({ success, authToken });
    } catch (e) {
      console.log(e.message);
      success = false;
      res.status(500).json({success, e});
    }
  }
);

// Login route
router.post(
  "/login",
  [body("email", "Please type email").isEmail(), body("password", "Password is required").exists()],

  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(404).json({success, 'error':"Invalid cred"});
      }

      const bcryptCompare = await bcrypt.compare(password, user.password);
      if (!bcryptCompare) {
        success = false;
        return res.status(400).json({ success, error: "Wrong Password" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (e) {
      console.log(e);
      success = false;
      res.json({success, error: " Internal Server error happened"});
    }
  }
);

// route 3: get user details
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Page not found" });
    }
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

module.exports = router;
