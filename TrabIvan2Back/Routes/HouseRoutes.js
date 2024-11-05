// routes/HouseRoutes.js
import { Router } from "express";
import HouseController from "../controllers/HouseController.js";

const router = Router();

// CRUD
router.post('/', HouseController.addHouse); // create
router.get('/:id', HouseController.getHouse); // read one
router.get('/', HouseController.getHouses); // read all
router.put('/:id', HouseController.updateHouse); // update
router.delete('/:id', HouseController.deleteHouse); // delete

export default router;
