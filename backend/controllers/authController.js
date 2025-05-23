const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { username, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, phone });

    const emailToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const url = `http://localhost:5000/api/auth/verify-email?token=${emailToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Vérification d'email",
      html: `<p>Merci de cliquer ici pour vérifier votre email : <a href="${url}">Vérifier</a></p>`,
    });

    await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE).verifications.create({
      to: user.phone,
      channel: "sms",
    });

    res.status(201).json({
      success: true,
      message: "Utilisateur enregistré. Vérifie ton email et téléphone.",
      data: { userId: user._id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }

    if (!user.isEmailVerified || !user.isPhoneVerified) {
      return res.status(401).json({ success: false, message: "Email ou téléphone non vérifié" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      data: { email: user.email, role: user.role, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ success: false, message: "Utilisateur introuvable" });
    }

    user.isEmailVerified = true;
    await user.save();

    res.json({ success: true, message: "Email vérifié avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Lien invalide ou expiré" });
  }
};

exports.verifyPhone = async (req, res) => {
  try {
    const { phone, code } = req.body;
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE)
      .verificationChecks.create({ to: phone, code });

    if (verification.status === "approved") {
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
      }
      user.isPhoneVerified = true;
      await user.save();
      return res.json({ success: true, message: "Téléphone vérifié avec succès" });
    } else {
      return res.status(400).json({ success: false, message: "Code incorrect" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
