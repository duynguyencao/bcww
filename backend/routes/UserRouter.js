const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const auth = require("../middeware/auth");


router.post("/admin/login", async(req, res) => {
    const { login_name, password } = req.body;
    try {
        const user = await User.findOne({ login_name, password });
        if (!user) return res.status(400).send({ error: "User not found" });
        req.session.user = { _id: user._id, login_name: user.login_name };
        res.json(user);
    } catch (error) {
        res.status(500).send({ error: "Internal error" });
    }
});


router.post("/admin/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out successfully" });
});

router.post("/admin/register", async(req, res) => {
    const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
    const check = await User.findOne({ login_name });
    if (check) return res.status(400).json({ error: "failed" });
    try {
        const newUser = new User({
            login_name,
            password,
            first_name,
            last_name,
            location,
            description,
            occupation
        })
        await newUser.save();
        res.json({ login_name });
    } catch (err) {
        res.json({ error: "failed" });
    }
})

router.get("/list", auth, async(req, res) => {
    try {
        const users = await User.find({}, "_id first_name last_name");
        const result = users.map((u) => ({
            _id: u._id,
            first_name: u.first_name,
            last_name: u.last_name,
        }));
        res.json(result);
    } catch (err) {
        res.status(500).send({ error: "Internal error" });
    }
});

router.get("/:id", auth, async(req, res) => {
    try {
        const user = await User.findById(
            req.params.id,
            "_id first_name last_name location description occupation"
        );
        if (!user) return res.status(400).send({ error: "User not found" });
        const userData = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            location: user.location,
            description: user.description,
            occupation: user.occupation,
        };
        res.json(userData);
    } catch (err) {
        res.status(400).send({ error: "Invalid user id" });
    }
});

module.exports = router;