async function sendMessage() {
  const userInput = document.getElementById("myText").value;
  const chatContainer = document.getElementById("output");

  showLoadingAnimation();

  if (userInput.trim() === "") return;

  chatContainer.innerHTML +=
    '<div class="user-message"><b>Me </b><br>' + userInput + "</div>";
  document.getElementById("myText").value = "";
  chatContainer.innerHTML += '<div class="extra-line"></div>'; // Add extra line spacer

  try {
    // Use fetch instead of XMLHttpRequest for simplicity
    const response = await fetch("sendMessage/" + userInput, {
      method: "POST",
      body: userInput,
    });
    if (!response.ok) {
      throw new Error("oopsies something's up with chatgpt");
    }
    //update chats sent//
    updateChatsSent();
    const data = await response.text();
    chatContainer.innerHTML +=
      '<div class="bot-message"><b>Phineas </b><br>' + data + "</div>";
    chatContainer.innerHTML += '<div class="extra-line"></div>'; // Add extra line spacer
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Hide loading animation after the response is received or an error occurs
    hideLoadingAnimation();
  }
}

function showLoadingAnimation() {
  const loadingAnimation = document.getElementById("loading-animation");
  loadingAnimation.style.display = "block";
  loadingAnimation.style.position = "fixed";
  loadingAnimation.style.top = "50%";
  loadingAnimation.style.left = "50%";
  loadingAnimation.style.transform = "translate(-50%, -50%)";
}

function hideLoadingAnimation() {
  document.getElementById("loading-animation").style.display = "none";
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

document.getElementById("sendButton").addEventListener("click", () => {
  sendMessage();
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

window.addEventListener("load", updateChatbotAchievement);

var start = new Date().getTime();

// Update time when the page is closed or refreshed
window.addEventListener("beforeunload", function () {
  var end = new Date().getTime();
  const minutesSpent = ((end - start) / 60000).toString();
  updateTimeStudied(minutesSpent);
});
