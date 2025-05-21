const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Le titre est requis"],
    trim: true,
    maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
  },
  description: {
    type: String,
    required: [true, "La description est requise"],
    maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
  },
  status: {
    type: String,
    enum: ["ouvert", "en cours", "résolu", "fermé"],
    default: "ouvert",
  },
  priority: {
    type: String,
    enum: ["basse", "moyenne", "haute", "urgente"],
    default: "moyenne",
  },
  category: {
    type: String,
    enum: ["matériel", "logiciel", "réseau", "autre"],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

ticketSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("Ticket", ticketSchema)
