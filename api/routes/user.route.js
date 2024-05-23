import express from "express";
import {
  testRoute,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

router.get("/test", testRoute);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);

export default router;