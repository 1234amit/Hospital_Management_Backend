import express from "express";
import { loginController, logoutController, registerController } from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddlewares.js";

//router object
const router = express.Router();

// register
router.post("/register", registerController);
// login
router.post("/login", loginController);
// logout routes
router.get("/logout", isAuth, logoutController);



export default router;