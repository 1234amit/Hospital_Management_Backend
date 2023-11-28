import express from "express";
import { loginController, logoutController, registerController, viewDoctorControllers } from "../controllers/userController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";

//router object
const router = express.Router();

// register
router.post("/register", registerController);
// login
router.post("/login", loginController);
// logout routes
// router.get("/logout", isAuth, logoutController);

//protected route auth for user
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected route for admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});


router.get("/view-doctor", requireSignIn, isAdmin, viewDoctorControllers);




export default router;