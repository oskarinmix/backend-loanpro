import AuthController from "../controllers/user.controller.js";
import { Router } from "express";

const {
  changePassword,
  isAuthorized,
  login,
  logout,
  register,
  updateUserBalance,
  changeUserStatus,
  getAllUsers,
  getUserById,
} = AuthController;
// const isAuth = require("../middlewares/Auth");

var router = Router();

/* LOGIN Route */
router.post("/login", login);
/* REGISTER Route */
router.post("/register", register);
/* CHECK AUTH Route */
router.get("/authorized", isAuthorized);
/* LOGOUT Route */
router.post("/logout", logout);
router.put("/change-password", changePassword);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/balance/:id", updateUserBalance);
router.put("/status/:id", changeUserStatus);
/* PROTECTED Route. */
// router.get("/protected", isAuth, function (req, res, next) {
//   res.status(200).json({ message: "Access to private route" });
// });
export default router;
