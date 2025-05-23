const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const morgan = require("morgan")
const helmet = require("helmet")

const loggerMiddleware = require("./middlewares/loggerMiddleware")

const authRoutes = require("./routes/authRoutes")
const ticketRoutes = require("./routes/ticketRoutes")

dotenv.config()

const app = express()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan("dev"))
app.use(loggerMiddleware)

app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)

app.get("/", (req, res) => {
  res.send("API de gestion des incidents est en ligne!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ message: "Une erreur est survenue!", error: err.message })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀Serveur démarré sur le port ${PORT}`)
})
