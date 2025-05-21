const Ticket = require("../models/Ticket")
const User = require("../models/User")
const ticketService = require("../services/ticketService")
const { validationResult } = require("express-validator")

exports.createTicket = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const ticket = await ticketService.createTicket({
      ...req.body,
      createdBy: req.user.id,
    })

    res.status(201).json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

exports.getTickets = async (req, res) => {
  try {
    const query = {}

    if (req.user.role !== "admin") {
      query.createdBy = req.user.id
    }

    if (req.query.status) {
      query.status = req.query.status
    }

    if (req.user.role === "admin" && req.query.userId) {
      query.createdBy = req.query.userId
    }

    const tickets = await ticketService.getTickets(query)

    res.json({
      success: true,
      count: tickets.length,
      data: tickets,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}


exports.getTicket = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" })
    }

    if (ticket.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" })
    }

    res.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}


exports.updateTicket = async (req, res) => {
  try {
    let ticket = await ticketService.getTicketById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" })
    }

    if (ticket.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" })
    }

    let updateData = req.body
    if (req.user.role !== "admin") {
      const { title, description, category } = req.body
      updateData = { title, description, category }
    }

    ticket = await ticketService.updateTicket(req.params.id, updateData)

    res.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}


exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" })
    }

    if (ticket.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" })
    }

    await ticketService.deleteTicket(req.params.id)

    res.json({
      success: true,
      data: {},
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}


exports.assignTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" })
    }

    const { userId } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    const ticket = await ticketService.assignTicket(req.params.id, userId)

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" })
    }

    res.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}
