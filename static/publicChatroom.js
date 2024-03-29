const socket = io();
let room = "default";

socket.on("connect", () => {
  console.log("Client connected");
});

socket.on("message", (message) => {
  const chatContainer = document.getElementById("output");
  chatContainer.innerHTML += "<p>" + message + "</p>";
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("join_error", (error) => {
  console.error("Failed to join room:", error.message);
});

function send() {
  console.log("public attempted to send");
  console.log(document.getElementById("message").value);
  const messageInput = document.getElementById("message").value;

  const storedUsername = localStorage.getItem("username");
  storedUsername2 = storedUsername.split("@")[0];

  socket.emit("message", storedUsername2 + ": " + messageInput);
  updateChatsSent();

  // Clear the message input field
  document.getElementById("message").value = "";
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    send();
  }
});

document.getElementById("sendButton").addEventListener("click", () => {
  send();
});

function updateChatsSent() {
  const userEmail = localStorage.getItem("username");

  fetch("/updateChatsSent", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error("Error updating chats sent:", error);
    });
}
