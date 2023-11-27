import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js'

// protected routes token base
export const requireSignIn = async (req, res, next) => {
  try {
      const token = req.headers.authorization;

      if (!token) {
          return res.status(401).json({
              success: false,
              message: "Authorization token is missing.",
          });
      }

      const decodedUser = JWT.verify(token, process.env.JWT_SECRET);
      console.log("Decoded User:", decodedUser); // Log decoded user

      const user = await userModel.findById(decodedUser._id);
      console.log("User:", user); // Log user

      if (!user) {
          return res.status(401).json({
              success: false,
              message: "User not found.",
          });
      }

      req.user = user; // Attach the user object to req
      next();
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "Internal Server Error",
      });
  }
};


// Admin auth
// protected routes for admin
//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};