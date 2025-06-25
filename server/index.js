require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, User } = require("./models");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.sync();
    // Seed a sample user if none exists
    const count = await User.count();
    if (count === 0) {
      await User.create({ username: "testuser", password: "testpass" });
      console.log("Seeded sample user: testuser / testpass");
    }
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

start();
