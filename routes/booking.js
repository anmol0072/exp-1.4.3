import express from "express";
import { redisClient } from "../redisclient.js";

const router = express.Router();

const bookedSeats = new Set();
const lockedSeats = new Set();


// LOCK SEAT
router.post("/lock", async (req, res) => {

const { seatNumber } = req.body;

try {

if (redisClient) {

const isBooked = await redisClient.get(`seat:${seatNumber}`);
const isLocked = await redisClient.get(`lock:${seatNumber}`);

if (isBooked) {
return res.status(400).json({ message: "Seat already booked" });
}

if (isLocked) {
return res.status(400).json({ message: "Seat temporarily locked" });
}

// lock for 10 seconds
await redisClient.set(`lock:${seatNumber}`, "locked", { EX: 10 });

return res.json({ message: "Seat locked for 10 seconds" });

}


// fallback memory
if (bookedSeats.has(seatNumber)) {
return res.status(400).json({ message: "Seat already booked" });
}

if (lockedSeats.has(seatNumber)) {
return res.status(400).json({ message: "Seat temporarily locked" });
}

lockedSeats.add(seatNumber);

setTimeout(() => lockedSeats.delete(seatNumber), 10000);

res.json({ message: "Seat locked for 10 seconds" });

} catch (err) {
res.status(500).json({ error: "Lock failed" });
}

});



// BOOK SEAT
router.post("/book", async (req, res) => {

const { seatNumber } = req.body;

try {

if (redisClient) {

const isBooked = await redisClient.get(`seat:${seatNumber}`);

if (isBooked) {
return res.status(400).json({ message: "Seat already booked" });
}

await redisClient.set(`seat:${seatNumber}`, "booked");

await redisClient.del(`lock:${seatNumber}`);

return res.json({ message: "Seat booked successfully" });

}


// fallback
if (bookedSeats.has(seatNumber)) {
return res.status(400).json({ message: "Seat already booked" });
}

bookedSeats.add(seatNumber);
lockedSeats.delete(seatNumber);

res.json({ message: "Seat booked successfully" });

} catch (err) {
res.status(500).json({ error: "Booking failed" });
}

});


export default router;