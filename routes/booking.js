import express from "express";
import { redisClient } from "../redisclient.js";

const router = express.Router();

router.post("/book", async (req, res) => {
  const { seatNumber } = req.body;

  const isBooked = await redisClient.get(`seat:${seatNumber}`);

  if (isBooked) {
    return res.status(400).json({ message: "Seat already booked!" });
  }

  await redisClient.set(`seat:${seatNumber}`, "booked");

  res.json({ message: "Seat booked successfully!" });
});

export default router;