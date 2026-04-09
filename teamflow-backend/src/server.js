import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { default: connectDB } = await import("./config/db.js");

const PORT = process.env.PORT || 5000;


// Connect DB first
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} and http://localhost:${PORT}`);
});