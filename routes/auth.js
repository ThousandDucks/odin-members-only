const { Router } = require("express");
const authController = require("../controllers/authController");
const passport = require("passport");

const authRouter = Router();

authRouter.get("/sign-up", authController.signUpGet);

authRouter.post("/sign-up", authController.signUpPost);

authRouter.get("/log-in", authController.logInGet);

authRouter.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in",
    })
);

module.exports = authRouter;