import express from "express";
import apiController from '../controller/apiController';
const router = express.Router();

/**
 * 
 * @param {*} app : express app
 */

const initApiRoutes = (app) => {
    router.get("/package-data", apiController.getPackageList);
    router.get("/read-package/:packageId", apiController.getPackageById);
    return app.use("/api", router);
}

export default initApiRoutes;