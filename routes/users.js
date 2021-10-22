const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    //On vérifie qu'on envoie bien un username
    if (req.fields.username === undefined) {
      res.status(400).json({ message: "Missing parameter(s)" });
    } else {
      const isUserExist = await User.findOne({ email: req.fields.email });
      //On vérifie que l'email en base de données soit bien disponible
      if (isUserExist !== null) {
        res.status(400).json({ message: "This email already has han account" });
      } else {
        //Etape 1 : encrypter le mot de passe
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(64);

        //Etape 2 : créer le nouvel utilisateur
        const newUser = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
            phone: req.fields.phone,
          },
          token: token,
          hash: hash,
          salt: salt,
        });

        //Etape 3 : sauvegarder ce nouvel utilisateur dans la DB
        await newUser.save();
        res.json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          account: newUser.account,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user === null) {
      res.status(400).json({ message: "Unauthorized" });
    } else {
      console.log(user.hash, "Hash à comparer");
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );
      console.log(newHash);
      if (user.hash === newHash) {
        res.json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
