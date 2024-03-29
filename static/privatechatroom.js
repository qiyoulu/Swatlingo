const socket = io();
let room = "default";

socket.on("connect", () => {
  console.log("Client connected");
});

socket.on("message", (message) => {
  const chatContainer = document.getElementById("output");
  chatContainer.innerHTML += "<p>" + message + "</p>";
});

socket.on("messagePrivateRoom", (combinedMsgArray) => {
  let message = combinedMsgArray[0];
  let room = combinedMsgArray[1];

  // Get the message output element for the specified room
  const selector = `#privateRoomOutput${room}`;

  //console.log(selector)
  //console.log(document.querySelector(selector).getAttribute("testClick"));

  //this is so that the output only shows up for people who have "joined the room"
  if (document.querySelector(selector).getAttribute("testClick") == "trueA") {
    document.querySelector(selector).innerHTML += `<p> ${message}</p>`;

    // //STYLING USING JOINERCOUNTER DATABASE, "joinersStyle" attribute
    // if (document.querySelector(selector).getAttribute("joinersStyle") == "one"){
    //     document.querySelector(selector).innerHTML += `<p style="color: green;">${message}</p>`;
    // }

    // if (document.querySelector(selector).getAttribute("joinersStyle") == "two"){
    //     document.querySelector(selector).innerHTML += `<p style="color: yellow;">${message}</p>`;
    // }

    // if (document.querySelector(selector).getAttribute("joinersStyle") == "at capacity"){
    //     document.querySelector(selector).innerHTML += `<p style="color: red;">${message}</p>`;
    // }
  } else {
    console.log("whoooops");
  }

  // document.querySelector(selector).style.visibility = "visible";
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("join_error", (error) => {
  console.error("Failed to join room:", error.message);
});

socket.on("roomCreated", (roomName) => {
  const roomElement = document.getElementById("roomsContainer");
  roomElement.style.display = "flex";
  roomElement.style.flexDirection = "column";

  const encompassingChatArea = document.createElement("div");
  encompassingChatArea.style.visibility = "hidden";
  //chat area is button
  const chatArea = document.createElement("button");
  chatArea.textContent = roomName;
  chatArea.setAttribute("id", roomName);
  chatArea.style.visibility = "visible";
  chatArea.classList.add("chat-area");
  roomElement.appendChild(encompassingChatArea);
  encompassingChatArea.appendChild(chatArea);

  const messageInput = document.createElement("input");
  messageInput.type = "text";
  messageInput.setAttribute("id", "privateRoomInput" + roomName);
  messageInput.placeholder = " hi! ¡hola! salut!";
  messageInput.style.visibility = "hidden";
  messageInput.classList.add("room-input"); // Add the "roomInput" class
  chatArea.appendChild(messageInput);
  // console.log(messageInput.checkVisibility());

  const messageOutput = document.createElement("div");
  messageOutput.setAttribute("id", "privateRoomOutput" + roomName);
  //messageOutput.textContent = 'privateRoomOutput' + roomName
  chatArea.appendChild(messageOutput);
  messageOutput.style.visibility = "hidden";
  messageOutput.setAttribute("testClick", "falseA");
  // console.log(messageOutput.getAttribute('testClick'));
  messageOutput.classList.add("room-output");

  //JOIN ROOM BUTTON BASICALLY
  //WILL UPDATE ROOM BUTTON TOO
  chatArea.addEventListener("click", async () => {
    chatArea.disabled = true;

    try {
      const response = await fetch(
        "initializeUpdate_counterJoiner/" +
          roomName.charAt(roomName.length - 1),
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("oopsies something's up counter data");
      }
      //console.log(await response.json());
      const intializationZero = await response.json();
      console.log("after intialization:");
      console.log(intializationZero);
    } catch (error) {
      console.log(error);
    }

    //const currentJoiners = fetch('retrieve_counterJoiner/' + roomName.charAt(roomName.length-1));
    const response2 = await fetch(
      "retrieve_counterJoiner/" + roomName.charAt(roomName.length - 1),
      {
        method: "POST",
      },
    );

    if (!response2.ok) {
      throw new Error("oopsies something's up counter data");
    }
    //console.log(await response.json());
    const currentJoiners = await response2.json();
    console.log("after retrieval:");
    console.log(currentJoiners);

    // Check if the room is at capacity
    if (currentJoiners >= 3) {
      messageOutput.setAttribute("testClick", "falseA");
      alert("Sorry, the room is at capacity. You cannot join at the moment.");
      return;
    } else {
      messageInput.style.visibility = "visible";
      messageOutput.style.visibility = "visible";
      messageOutput.setAttribute("testClick", "trueA");
    }

    //   messageOutput.setAttribute("joinersStyle", "nobody");
    //   if (currentJoiners == "2") {
    //     messageOutput.setAttribute("joinersStyle", "one");
    //   } else if (currentJoiners == "4") {
    //     messageOutput.setAttribute("joinersStyle", "two");
    //   } else {
    //     messageOutput.setAttribute("joinersStyle", "at capacity");
    //   }

    //   console.log("you joiner attributes");
    //   console.log(messageOutput.getAttribute("joinersStyle"));
    // } catch (error) {
    //   console.log(error);
    // }
  });

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const message = event.target.value;
      //messageOutput.innerHTML += `<p>${roomName}</p>`;
      const storedUsername = localStorage.getItem("username");
      console.log("read in username");
      console.log(storedUsername);
      const storedUsername2 = storedUsername.split("@")[0];
      console.log(storedUsername2);

      socket.emit(
        "messagePrivateRoom",
        storedUsername2 + ": " + message,
        roomName,
      );
      updateChatsSent();
      event.target.value = "";
    }
  });
});

function send() {
  //socket.emit("join", room);
  // Send the message to the server
  const messageInput = document.getElementById("message").value;
  socket.emit("message", messageInput);
  updateChatsSent();

  // Clear the message input field
  document.getElementById("message").value = "";
}

//let counterPrivateRoom = 0
async function newRoom() {
  //counterPrivateRoom = counterPrivateRoom + 1;
  const responseCounter = await fetch("get_counter");
  const dataCounter = await responseCounter.json();

  const roomName = "new-private-room" + dataCounter;
  socket.emit("join", roomName);
}

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
