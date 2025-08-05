import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import {
    getMetaUser
} from "../controllers/metaController.js";

const router = express.Router();



// router.get(
//     "/admin",
//     isAuthenticated,
//     isAuthorized("Admin"),
//     getMetaEmployer
// );

router.get(
    "/user",
    isAuthenticated,
    isAuthorized("User"),
    getMetaUser
);



// router.get(
//     "/pdf",
//     isAuthenticated,

//     pdfDownload
// );



export default router;