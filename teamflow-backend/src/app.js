import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import authRoutes from "./routes/auth.routes.js"
import orgRoutes from "./routes/org.routes.js"
import inviteRoutes from "./routes/invite.routes.js"
import projectRoutes from "./routes/project.routes.js"
import taskRoutes from "./routes/task.routes.js"

//temp
import testRoutes from "./routes/test.routes.js"

const app = express();

//Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
})

app.use(helmet())
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
app.use(cors())

app.set("trust proxy", 1);
app.use(express.json({ limit: "10kb" }));

//Rate Limiting
const limiter = rateLimit({
  max: 100 , //100 requests
  windowMs: 15*60*1000 , //15 mins
  message: "Too many requests, try again later"
})
app.use("/api", limiter)

//Mongo sanitize
// app.use(mongoSanitize())
app.use((req, res, next) => {
  if (req.body) {
    mongoSanitize()(req, res, next);
  } else {
    next();
  }
});

// Prevent Parameter Pollution
app.use(hpp())


//Authorization Routes
app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)

//Organization Routes
app.use("/api/org", orgRoutes)

//Invite Routes
app.use("/api/invite", inviteRoutes);

//Project Routes
app.use("/api/projects", projectRoutes)

//Task Routes
app.use("/api/tasks", taskRoutes)

app.get("/", (req, res) => {
  res.send("TeamFlow API Running...");
});

export default app;