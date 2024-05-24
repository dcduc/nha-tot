import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:slug", verifyToken, deleteListing);
router.put("/update/:slug", verifyToken, updateListing);
router.get("/get/:slug", getListing);
router.get("/get", getListings);

export default router;
