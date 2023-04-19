import express from "express";
import { body } from "express-validator";
import requestHandler from "../handler/request.handler.js";
import userModel from "../models/user.model.js";
import userController from "../controller/user.controller.js";

const router = express.Router();

router.post(
    "/signup",
    body("username")
        .exists().withMessage("username is required")
        .isLength({ min: 8 }).withMessage("username minimum 8 characters")
        .custom(async value => {
            const user = await userModel.findOne({ username: value });
            if (user) return Promise.reject("username already used");
        }),
    body("firstName")
        .exists().withMessage("firstName is required"),
    body("lastName")
        .exists().withMessage("lastName is required"),
    body("email")
        .exists().withMessage("email is required"),
    body("password")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
    body("confirmPassword")
        .exists().withMessage("confirmPassword is required")
        .isLength({ min: 8 }).withMessage("confirmPassword minimum 8 characters")
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error("confirmPassword not match");
            return true;
        }),
    requestHandler.validate,
    userController.signup
);

router.post(
    "/login",
    body("username")
        .exists().withMessage("username is required")
        .isLength({ min : 8 }).withMessage("username minium 8 characters"),
    body("password")
        .exists().withMessage("password is required")
        .isLength({ min : 8 }).withMessage("Password minium 8 characters"),
    requestHandler.validate,
    userController.login
)

export default router;