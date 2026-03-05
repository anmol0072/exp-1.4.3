const seatContainer = document.getElementById("seats");
const message = document.getElementById("message");

for (let i = 1; i <= 20; i++) {

const btn = document.createElement("button");
btn.innerText = i;
btn.classList.add("seat");

btn.onclick = async () => {

const lockRes = await fetch("/api/lock", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ seatNumber: i })
});

const lockData = await lockRes.json();

message.innerText = lockData.message;

if (lockRes.status !== 200) return;

btn.style.background = "#f39c12";

const confirmBooking = confirm("Confirm booking seat " + i + "?");

if (!confirmBooking) return;

const bookRes = await fetch("/api/book", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ seatNumber: i })
});

const bookData = await bookRes.json();

message.innerText = bookData.message;

if (bookRes.status === 200) {
btn.classList.add("booked");
btn.disabled = true;
}

};

seatContainer.appendChild(btn);

}