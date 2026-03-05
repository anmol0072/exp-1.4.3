import express from "express";

const router = express.Router();

const bookedSeats = new Set();
const lockedSeats = new Set();


// LOCK SEAT
router.post("/lock", (req, res) => {

const { seatNumber } = req.body;

if (bookedSeats.has(seatNumber)) {
return res.status(400).json({ message: "Seat already booked" });
}

if (lockedSeats.has(seatNumber)) {
return res.status(400).json({ message: "Seat temporarily locked" });
}

lockedSeats.add(seatNumber);

// unlock after 10 seconds
setTimeout(() => {
lockedSeats.delete(seatNumber);
}, 10000);

res.json({ message: "Seat locked for 10 seconds" });

});


// BOOK SEAT
router.post("/book", (req, res) => {

const { seatNumber } = req.body;

if (bookedSeats.has(seatNumber)) {
return res.status(400).json({ message: "Seat already booked" });
}

bookedSeats.add(seatNumber);
lockedSeats.delete(seatNumber);

res.json({ message: "Seat booked successfully" });

});


export default router;