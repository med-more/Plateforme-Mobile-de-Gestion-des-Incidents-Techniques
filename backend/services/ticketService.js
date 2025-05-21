const Ticket = require("../models/Ticket")

/**
 * Create a new ticket
 * @param {Object} ticketData 
 * @returns {Promise<Object>} 
 */
exports.createTicket = async (ticketData) => {
  const ticket = new Ticket(ticketData)
  await ticket.save()
  return ticket
}

/**
 * Get tickets based on query
 * @param {Object} query - Query parameters
 * @returns {Promise<Array>} Array of tickets
 */
exports.getTickets = async (query) => {
  return await Ticket.find(query)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 })
}

/**
 * Get ticket by ID
 * @param {String} id - Ticket ID
 * @returns {Promise<Object>} Ticket object
 */
exports.getTicketById = async (id) => {
  return await Ticket.findById(id).populate("createdBy", "name email").populate("assignedTo", "name email")
}

/**
 * Update ticket
 * @param {String} id - Ticket ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated ticket
 */
exports.updateTicket = async (id, updateData) => {
  return await Ticket.findByIdAndUpdate(id, { $set: updateData }, { new: true })
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
}

/**
 * Delete ticket
 * @param {String} id - Ticket ID
 * @returns {Promise<void>}
 */
exports.deleteTicket = async (id) => {
  await Ticket.findByIdAndDelete(id)
}

/**
 * Assign ticket to user
 * @param {String} ticketId - Ticket ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Updated ticket
 */
exports.assignTicket = async (ticketId, userId) => {
  return await Ticket.findByIdAndUpdate(
    ticketId,
    {
      $set: {
        assignedTo: userId,
        status: "en cours",
      },
    },
    { new: true },
  )
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
}

/**
 * Get ticket statistics
 * @returns {Promise<Object>} Ticket statistics
 */
exports.getTicketStats = async () => {
  const stats = await Ticket.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])

  // Convert to object with status as keys
  const result = {}
  stats.forEach((stat) => {
    result[stat._id] = stat.count
  })

  return result
}
