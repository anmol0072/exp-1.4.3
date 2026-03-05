import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bookingRoutes from "./routes/booking.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve public files
app.use(express.static("public"));

// serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/api", bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});