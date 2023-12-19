import express from "express";
import packageController from '../controller/packageController';
import tourController from '../controller/tourController';
const router = express.Router();

/**
 * 
 * @param {*} app : express app
 */

const initApiRoutes = (app) => {
    router.get("/package/read-by-address", packageController.readPackageByAddressList);
    router.post("/package/create", packageController.createPackage);
    router.get("/package/read", packageController.readPackagePagination);
    router.put("/package/update", packageController.updatePackage);
    router.delete("/package/delete", packageController.deletePackage);

    router.post("/tour/create", tourController.createTour);
    router.get("/tour/read", tourController.readTourPagination);
    router.get("/tour/read-by-id", tourController.readTourById);
    router.delete("/tour/delete", tourController.deleteTour);
    // routern.get("/package/read/:packageId", packageController.getPackageById);
    return app.use("/api", router);
}

export default initApiRoutes;