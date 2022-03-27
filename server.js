require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const credientials = require("./middleware/credientials");
const corsOptions = require("./config/cors-options");
const connectDB = require("./config/db-conn");

const rootRouter = require("./routes/root");
const employeesRouter = require("./routes/api/employees");
const registerRouter = require("./routes/register");
const authRouter = require("./routes/auth");
const refreshRouter = require("./routes/refresh");
const logoutRouter = require("./routes/logout");
const verifyJWT = require("./middleware/verifyjwt");

// connect to mongo database
connectDB();

// assign Port value
const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger);

app.use(credientials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", rootRouter);
app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);

app.use(verifyJWT);
app.use("/employees", employeesRouter);

app.all("*", (req, resp) => {
  resp.status(404);

  if (req.accepts("html")) {
    resp.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    resp.json({ err: "404 Not Found" });
  } else {
    resp.type("txt").json({ err: "404 Not Found" });
  }
});

app.use(errorHandler);

// check for mongodb connection
mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, console.log(`listening on port ${PORT}...`));
});
