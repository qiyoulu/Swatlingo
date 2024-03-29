// Function to validate email and initiate form submission
function validateEmail(event) {
  event.preventDefault();
  const email = document.getElementById("email_box").value.trim().toLowerCase();
  const swatEmail = "@swarthmore.edu";

  if (email.endsWith(swatEmail)) {
    alert("You can use your email to log in next time :)");
    saveUsername(email);
    submitForm(email);
  } else {
    alert("Please use an @swarthmore.edu email :(");
  }
}

// Function to save username to local storage
function saveUsername(email) {
  localStorage.setItem("email", email);
  localStorage.setItem("username", email);
}

// Function to update username on the server
function updateUsername(event) {
  event.preventDefault();
  const newUsername = document.getElementById("username_box").value.trim();
  const userEmail = localStorage.getItem("email");

  if (newUsername.length === 0) {
    alert("Username can't be empty :(");
    return;
  }

  console.log(newUsername);

  const data = {
    email: userEmail,
    newUsername: newUsername,
  };

  fetch("/update-username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .then(() => {
      // Update the username in local storage after a successful server update
      saveNewUsername(newUsername);
      alert("Username updated successfully!");
    })
    .catch(handleError);
}

function updateDisplayedUsername() {
  const storedUsername = localStorage.getItem("username");
  const usernameDisplay = document.getElementById("username_display");
  if (storedUsername) {
    usernameDisplay.textContent = "Welcome back, " + storedUsername + "!";
  } else {
    usernameDisplay.textContent = "Please log in to track your progress :)";
  }
}

// Function to save new username to local storage
function saveNewUsername(newUsername) {
  localStorage.setItem("username", newUsername);
  updateDisplayedUsername();
}

// Function to submit form data to the server
function submitForm(email) {
  const data = { email };

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .then(handleSuccess)
    .catch(handleError);
}

// Common function to handle fetch responses
function handleResponse(response) {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Function to handle successful fetch response
function handleSuccess(responseData) {
  console.log("Response from server:", responseData.message);
  if (responseData.redirectURL) {
    window.location.href = responseData.redirectURL;
  } else {
    console.log("Login successful, but no redirectURL provided.");
  }
}

// Function to handle fetch errors
function handleError(error) {
  console.error("Failed to POST data:", error);
}

// Function to fetch and display time studied
function getTimeStudied() {
  const userEmail = localStorage.getItem("username");
  var origin = window.location.origin;
  const url =
    origin + `/get_time_studied?email=${encodeURIComponent(userEmail)}`;

  fetch(url)
    .then(handleResponse)
    .then((data) => {
      if (data.success) {
        displayTimeStudied(data.time_spent);
        checkboxMinutes(data.time_spent);
      } else {
        console.error("Failed to retrieve time studied:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching time studied:", error);
    });
}

// Function to display time studied on the page
function displayTimeStudied(timeStudied) {
  const timeStudiedElement = document.getElementById("time_studied");
  timeStudiedElement.textContent = `${timeStudied}`;
}

// Function to fetch and display chats sent
function getChatsSent() {
  const userEmail = localStorage.getItem("username");
  var origin = window.location.origin;
  const url = origin + `/get_chats_sent?email=${encodeURIComponent(userEmail)}`;

  fetch(url)
    .then(handleResponse)
    .then((data) => {
      if (data.success) {
        displayChatsSent(data.chats_sent);
        checkboxMessages(data.chats_sent);
      } else {
        console.error("Failed to retrieve chats sent:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching chats sent:", error);
    });
}

// Function to display chats sent on the page
function displayChatsSent(chatsSent) {
  const chatsSentElement = document.getElementById("chats_sent");
  chatsSentElement.textContent = `${chatsSent}`;
}

// Function to fetch and display streak
function getStreak() {
  const userEmail = localStorage.getItem("username");
  var origin = window.location.origin;
  const url = origin + `/get_streak?email=${encodeURIComponent(userEmail)}`;

  fetch(url)
    .then(handleResponse)
    .then((data) => {
      if (data.success) {
        displayStreak(data.streak);
        checkboxStreak(data.streak);
      } else {
        console.error("Failed to retrieve streak:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching streak:", error);
    });
}

// Function to display streak  on the page
function displayStreak(streak) {
  updateStreak();
  const streakElement = document.getElementById("streak");
  streakElement.textContent = `${streak}`;
}

// Function to update streak on the server
function updateStreak() {
  const userEmail = localStorage.getItem("username");

  fetch("/updateStreak", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error("Error updating streak:", error);
    });
}

//Update chatbot achievement
function updateChatbotAchievement() {
  const userEmail = localStorage.getItem("username");

  fetch("/updateChatbotAchievement", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error("Error updating chatbot achievement:", error);
    });
}

function updatePublicChatAchievement() {
  const userEmail = localStorage.getItem("username");

  fetch("/updatePublicChatAchievement", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error("Error updating public chat achievement:", error);
    });
}

function updatePrivateChatAchievement() {
  const userEmail = localStorage.getItem("username");

  fetch("/updatePrivateChatAchievement", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error("Error updating public chat achievement:", error);
    });
}

function updateMinutesSpent() {
  const userEmail = localStorage.getItem("username");
  fetch("/updateMinutesSpent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail }),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error("Error updating minutes", error);
    });
}

function getOtherAchievements() {
  const userEmail = localStorage.getItem("username");
  var origin = window.location.origin;
  const url =
    origin + `/get_other_achievements?email=${encodeURIComponent(userEmail)}`;

  fetch(url)
    .then(handleResponse)
    .then((data) => {
      if (data.success) {
        if (data.made_account) {
          document.getElementById("made_account").innerHTML =
            "✓ " + document.getElementById("made_account").textContent;
          document.getElementById("made_account").style.color =
            "rgb(235, 111, 146)";
        }
        if (data.chat_with_chatbot) {
          document.getElementById("chat_with_chatbot").innerHTML =
            "✓ " + document.getElementById("chat_with_chatbot").textContent;
          document.getElementById("chat_with_chatbot").style.color =
            "rgb(235, 111, 146)";
        }
        if (data.chat_in_public) {
          document.getElementById("chat_in_public").innerHTML =
            "✓ " + document.getElementById("chat_in_public").textContent;
          document.getElementById("chat_in_public").style.color =
            "rgb(235, 111, 146)";
        }
        if (data.chat_in_private) {
          document.getElementById("chat_in_private").innerHTML =
            "✓ " + document.getElementById("chat_in_private").textContent;
          document.getElementById("chat_in_private").style.color =
            "rgb(235, 111, 146)";
        }
      } else {
        console.error("Failed to retrieve achievements:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching achievements:", error);
    });
}

function checkboxStreak(days) {
  if (parseInt(days) >= 2) {
    document.getElementById("2_streak").innerHTML =
      "✓ " + document.getElementById("2_streak").textContent;
    document.getElementById("2_streak").style.color = "rgb(246, 193, 119)";
  }
  if (parseInt(days) >= 7) {
    document.getElementById("7_streak").innerHTML =
      "✓ " + document.getElementById("7_streak").textContent;
    document.getElementById("7_streak").style.color = "rgb(246, 193, 119)";
  }
  if (parseInt(days) >= 14) {
    document.getElementById("14_streak").innerHTML =
      "✓ " + document.getElementById("14_streak").textContent;
    document.getElementById("14_streak").style.color = "rgb(246, 193, 119)";
  }
  if (parseInt(days) >= 28) {
    document.getElementById("28_streak").innerHTML =
      "✓ " + document.getElementById("28_streak").textContent;
    document.getElementById("28_streak").style.color = "rgb(246, 193, 119)";
  }
}

function checkboxMessages(messages) {
  if (parseInt(messages) >= 10) {
    document.getElementById("10_chats").innerHTML =
      "✓ " + document.getElementById("10_chats").textContent;
    document.getElementById("10_chats").style.color = "rgb(62, 143, 176)";
  }
  if (parseInt(messages) >= 50) {
    document.getElementById("50_chats").innerHTML =
      "✓ " + document.getElementById("50_chats").textContent;
    document.getElementById("50_chats").style.color = "rgb(62, 143, 176)";
  }
  if (parseInt(messages) >= 100) {
    document.getElementById("100_chats").innerHTML =
      "✓ " + document.getElementById("100_chats").textContent;
    document.getElementById("100_chats").style.color = "rgb(62, 143, 176)";
  }
  if (parseInt(messages) >= 500) {
    document.getElementById("500_chats").innerHTML =
      "✓ " + document.getElementById("500_chats").textContent;
    document.getElementById("500_chats").style.color = "rgb(62, 143, 176)";
  }
}

function checkboxMinutes(minutes) {
  if (parseInt(minutes) >= 5) {
    document.getElementById("5_minutes").innerHTML =
      "✓ " + document.getElementById("5_minutes").textContent;
    document.getElementById("5_minutes").style.color = "rgb(196, 167, 231)";
  }
  if (parseInt(minutes) >= 15) {
    document.getElementById("15_minutes").innerHTML =
      "✓ " + document.getElementById("15_minutes").textContent;
    document.getElementById("15_minutes").style.color = "rgb(196, 167, 231)";
  }
  if (parseInt(minutes) >= 30) {
    document.getElementById("30_minutes").innerHTML =
      "✓ " + document.getElementById("30_minutes").textContent;
    document.getElementById("30_minutes").style.color = "rgb(196, 167, 231)";
  }
  if (parseInt(minutes) >= 60) {
    document.getElementById("60_minutes").innerHTML =
      "✓ " + document.getElementById("60_minutes").textContent;
    document.getElementById("60_minutes").style.color = "rgb(196, 167, 231)";
  }
}
