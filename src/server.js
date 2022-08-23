import AuthRoutes from "./routes/user.routes.js";
import OperationRoutes from "./routes/operation.routes.js";
import RecordsRoutes from "./routes/record.routes.js";
import configurePassport from "./libs/passportConfig.js";
import cors from "cors";
import dbConnect from "./libs/dbConnection.js";
import dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import passport from "passport";

dotenv.config();
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    AllowedOrigins: "*",
  })
);
//DATABASE CONNECTION
app.use(passport.initialize());
configurePassport(passport);
dbConnect();
//ROUTES
app.use("/auth", AuthRoutes);
// app.use("/users", AuthRoutes);
app.use("/operations", OperationRoutes);
app.use("/records", RecordsRoutes);
//LISTEN
app.listen(process.env.PORT || 4000, () => {
  console.log(`SERVER LISTENING ON PORT ${process.env.PORT || 4000}`);
});
