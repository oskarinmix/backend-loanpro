import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

// FUNCTION CORRECTED AND WORKING LOGIN
const login = (req, res, next) => {
  passport.authenticate("local", (err, user, done) => {
    if (err) throw err;
    if (!user) {
      res.statusMessage = "Email or password incorrect";
      res.status(401).send({ msg: "Email or password incorrect", ok: false });
      return;
    }

    user.password = "";
    res.status(200).json({
      msg: "Authenticated Succesfully",
      ok: true,
      token: jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: 3600,
      }),
      user,
    });
  })(req, res, next);
};
//

// FUNCTION CORRECTED AND WORKING REGISTER
const register = (req, res) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    if (err) throw err;
    if (user) {
      res.statusMessage = "EMAIL_REGISTERED";
      res.status(400).send({ msg: "User Already Exists", ok: false });
      return;
    }
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      balance: req.body.balance,
      status: req.body.status,
    });
    try {
      await newUser.save();
      newUser.password = "";
      res.statusMessage = "USER_CREATED";
      res.status(200).json({
        msg: "User Created Succesfully",
        ok: true,
        token: jwt.sign({ user: newUser }, process.env.JWT_SECRET),
      });
    } catch (error) {
      res.statusMessage = "ERROR_REGISTERING_USER";
      res.status(400).send({ msg: "Error Creating User", ok: false, error });
    }
  });
};
//
const isAuthorized = (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json({ auth: true, user: req.user, message: "User is Authenticated" });
  } else {
    res.json({ auth: false, message: "User is not Authenticated" });
  }
};

const logout = (req, res) => {
  if (req.user && req.isAuthenticated()) {
    req.logout();
    req.session.destroy();
    res.json({ auth: false, message: "User is not Authenticated" });
  } else {
    res.json({ auth: false, message: "No session Active" });
  }
};
const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.statusMessage = "USER_NOT_FOUND";
      res.status(400).send({ msg: "No user with this email ", ok: false });
      return;
    }
    const isMatch = await user.validatePassword(oldPassword);
    if (!isMatch) {
      res.statusMessage = "PASSWORD_INCORRECT";
      res.status(400).send({ msg: "Old password not match", ok: false });
      return;
    }
    await User.findOneAndUpdate(
      { email: email },
      { password: await bcrypt.hash(newPassword, 10) }
    );
    res.statusMessage = "PASSWORD_UPDATED";
    res.status(200).json({ msg: "Password update successfully", ok: true });
  } catch (error) {
    res.statusMessage = "ERROR_UPDATING_PASSWORD";
    res.status(400).send({ msg: "Error updating password", ok: false, error });
    return;
  }
};
const updateUserBalance = async (req, res) => {
  const { balance } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.statusMessage = "USER_NOT_FOUND";
      res.status(400).send({ msg: "No user with this email ", ok: false });
      return;
    }
    const newUser = await User.findOneAndUpdate(
      { _id: id },
      { balance: Number(balance) },
      { new: true }
    );
    res.statusMessage = "BALANCE_UPDATED";
    res
      .status(200)
      .json({ msg: "Balance update successfully", ok: true, user: newUser });
  } catch (error) {
    res.statusMessage = "ERROR_UPDATING_BALANCE";
    res.status(400).send({ msg: "Error updating balance", ok: false, error });
    return;
  }
};
const reloadUserBalance = async (req, res) => {
  const { balance } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.statusMessage = "USER_NOT_FOUND";
      res.status(400).send({ msg: "No user with this email ", ok: false });
      return;
    }
    const newUser = await User.findOneAndUpdate(
      { _id: id },
      { balance: Number(user.balance) + Number(balance) },
      { new: true }
    );
    res.statusMessage = "BALANCE_UPDATED";
    res
      .status(200)
      .json({ msg: "Balance update successfully", ok: true, user: newUser });
  } catch (error) {
    res.statusMessage = "ERROR_UPDATING_BALANCE";
    res.status(400).send({ msg: "Error updating balance", ok: false, error });
    return;
  }
};
const changeUserStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const validStatus = ["ACTIVE", "INACTIVE"];
  if (!validStatus.includes(status)) {
    res.statusMessage = "ERROR_UPDATING_STATUS";
    res.status(400).send({ msg: "Invalid status", ok: false });
    return;
  }
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.statusMessage = "USER_NOT_FOUND";
      res.status(400).send({ msg: "No user with this email ", ok: false });
      return;
    }
    const newUser = await User.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    );
    res.statusMessage = "STATUS_UPDATED";
    res
      .status(200)
      .json({ msg: "Status update successfully", ok: true, user: newUser });
  } catch (error) {
    res.statusMessage = "ERROR_UPDATING_STATUS";
    res.status(400).send({ msg: "Error updating status", ok: false, error });
    return;
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.statusMessage = "USERS_FOUND";
    res.status(200).json({ msg: "Users found", ok: true, users });
  } catch (error) {
    res.statusMessage = "ERROR_GETTING_USERS";
    res.status(400).send({ msg: "Error getting users", ok: false, error });
    return;
  }
};
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, { password: 0 });
    res.statusMessage = "USER_FOUND";
    res.status(200).json({ msg: "User found", ok: true, user });
  } catch (error) {
    res.statusMessage = "ERROR_GETTING_USER";
    res.status(400).send({ msg: "Error getting user", ok: false, error });
    return;
  }
};
export default {
  login,
  register,
  isAuthorized,
  logout,
  changePassword,
  updateUserBalance,
  changeUserStatus,
  getAllUsers,
  getUserById,
  reloadUserBalance,
};
