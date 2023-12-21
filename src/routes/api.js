import express from "express";
import packageController from '../controller/packageController';
import tourController from '../controller/tourController';
import travelController from '../controller/travelController';
const router = express.Router();

/**
 * 
 * @param {*} app : express app
 */

const initApiRoutes = (app) => {
    router.post("/package/create", packageController.createPackage);
    router.get("/package/read-by-address", packageController.readPackageByAddressList);
    router.get("/package/read", packageController.readPackagePagination);
    router.put("/package/update", packageController.updatePackage);
    router.delete("/package/delete", packageController.deletePackage);

    router.post("/tour/create", tourController.createTour);
    router.get("/tour/read", tourController.readTourPagination);
    router.get("/tour/read-by-id", tourController.readTourById);
    router.put("/tour/update", tourController.updateTour);
    router.delete("/tour/delete", tourController.deleteTour);

    router.get("/travel/read", travelController.readTravelPagination);
    router.get("/travel/read-by-id", travelController.readTravelById);
    router.post("/travel/create", travelController.createTravel);
    router.put("/travel/update", travelController.updateTravel);
    router.delete("/travel/delete", travelController.deleteTravel);
    // routern.get("/package/read/:packageId", packageController.getPackageById);
    return app.use("/api", router);
}

export default initApiRoutes;