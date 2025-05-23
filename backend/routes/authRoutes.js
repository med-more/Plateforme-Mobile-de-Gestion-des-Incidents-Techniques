const express = require('express');
const { check } = require('express-validator');
const {register,login,verifyEmail,verifyPhone,
} = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');

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

module.exports = router;
