const express = require("express")
const { check } = require("express-validator")
const ticketController = require("../controllers/ticketController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const router = express.Router()

router.use(authMiddleware)


router.post(
  "/",
  [
    check("title", "Le titre est requis").not().isEmpty(),
    check("description", "La description est requise").not().isEmpty(),
    check("category", "La catégorie est requise").isIn(["matériel", "logiciel", "réseau", "autre"]),
  ],
  ticketController.createTicket,
)


router.get("/", ticketController.getTickets)


router.get("/:id", ticketController.getTicket)


router.put("/:id", ticketController.updateTicket)


router.delete("/:id", ticketController.deleteTicket)


router.put("/:id/assign", roleMiddleware("admin"), ticketController.assignTicket)

module.exports = router
