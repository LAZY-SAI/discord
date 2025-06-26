import express from "express";
import { CreateServer,getServer,deleteServer } from "../controller/Controller.js";


const router = express.Router();

router.post("/", CreateServer)
router.get("/",getServer)
router.delete("/:id",deleteServer)
export default router;