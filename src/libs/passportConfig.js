import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model.js";

const authenticateFunction = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return done(null, false);
    }
    const isMatch = await user.validatePassword(password);
    if (isMatch) {
      delete user.password;
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
};
const configurePassport = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, authenticateFunction)
  );

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      const userInformation = {
        name: user.name,
        email: user.email,
        id: user._id,
      };
      return done(null, userInformation);
    } catch (error) {
      return done(error, false);
    }
  });
};

export default configurePassport;
