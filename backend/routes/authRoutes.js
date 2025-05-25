const express = require('express');
const { check } = require('express-validator');
const { register, login, verifyEmail, verifyPhone, } = require('../controllers/authController');
const User = require('../models/User');

const authMiddleware = require('../middlewares/authMiddleware');

const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',
  [
    check('email', 'Email invalide').isEmail(),
    check('password', 'Le mot de passe doit contenir au moins 8 caractères').isLength({ min: 6 }),
    check('username', 'Le nom d\'utilisateur est requis').notEmpty(),
  ],
  register,
);

router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-phone', verifyPhone);
router.use(authMiddleware);
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.json({ message: 'Utilisateur mis à jour avec succès', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;

