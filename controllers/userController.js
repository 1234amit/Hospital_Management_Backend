import { comparePasswrd } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// register controller code
export const registerController = async (req, res) => {
    try {
      const { name, email, password, address, city, country, phone } = req.body;
      // validation
      if (
        !name ||!email ||!password ||!city ||!address ||!country ||!phone
      ) {
        return res.status(500).send({
          success: false,
          message: "Please Provide All Fields",
        });
      }
      //check exisiting user
      const exisitingUSer = await userModel.findOne({ email });
      //validation
      if (exisitingUSer) {
        return res.status(500).send({
          success: false,
          message: "email already taken",
        });
      }
      const user = await userModel.create({
        name,
        email,
        password,
        address,
        city,
        country,
        phone,
      });
      res.status(201).send({
        success: true,
        message: "Registeration Success, please login",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Register API",
        error,
      });
    }
};


// login controller
export const loginController = async (req, res) => {
  try {
      const { email, password } = req.body;

      // validation
      if (!email || !password) {
          return res.status(404).send({
              success: false,
              message: "Invalid email and password",
          });
      }
      // check user
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(404).send({
              success: false,
              message: "Email is not register"
          });
      }

      const match = await comparePasswrd(password, user.password);
      if (!match) {
          return res.status(200).send({
              success: false,
              message: "Invalid password"
          });
      }

      // token
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
      });

      res.status(200).send({
          success: true,
          message: "login successfully",
          user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              adddress: user.address,
              country: user.country,
              state: user.state,
              role: user.role,
          },
          token,
      })


  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error in login",
          error,
      })
  }
}


// logout controller code
export const logoutController = async(req, res)=>{
    try{
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false,
          })
          .send({
            success: true,
            message: "Logout SUccessfully",
        });

    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error for logout API",
            error,
        })
    }
}
  