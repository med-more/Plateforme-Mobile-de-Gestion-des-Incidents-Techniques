import * as Yup from 'yup';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,3}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("L'email n'est pas valide")
    .required("L'email est requis"),

  password: Yup.string()
    .required("Le mot de passe est requis")
    .min(8, "Minimum 8 caractères")
    .max(12, "Maximum 12 caractères")
});

export const registerSchema = Yup.object({
  username: Yup.string()
    .required("Le nom d'utilisateur est requis")
    .min(3, "Minimum 3 caractères")
    .max(30, "Maximum 30 caractères")
    .matches(/^[a-zA-Z0-9_-]+$/, "Caractères autorisés : lettres, chiffres, tirets et underscores"),

  email: Yup.string()
    .email("L'email n'est pas valide")
    .required("L'email est requis"),

  phoneNumber: Yup.string()
    .matches(phoneRegex, "Numéro de téléphone invalide")
    .required("Le numéro est requis"),

  password: Yup.string()
    .required("Le mot de passe est requis")
    .min(8, "Minimum 8 caractères")
    .max(12, "Maximum 12 caractères")
    .matches(
      passwordRegex,
      "Doit contenir : 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial"
    ),

  confirmPassword: Yup.string()
    .required("Confirmez le mot de passe")
    .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas"),

  role: Yup.string()
    .required("Le rôle est requis")
    .oneOf(["user", "admin"], "Rôle invalide")
});
