# Basic Information

- **Project Title:** Swatlingo
- **Group Number:** 9
- **Team Members and Email Addresses:**
  - T Sallie: tsallie1@swarthmore.edu
  - Yana Outkin: youtkin1@swarthmore.edu
  - Ark Lu: qlu1@swarthmore.edu
  - Allison Chong: achong1@swarthmore.edu
- **Team Git Repository URL:** [https://github.swarthmore.edu/youtkin1/Swatlingo](https://github.swarthmore.edu/youtkin1/Swatlingo)

# Use

Open [http://swe-swatlingo.sccs.swarthmore.edu/](http://swe-swatlingo.sccs.swarthmore.edu/) in your browser

# Development

```
source .venv/bin/activate
python -m pip install -r requirements.txt --upgrade
npm install --upgrade
./run.sh
```

Open [http://127.0.0.1:1234/](http://127.0.0.1:1234/) in your browser

# Description

Swatlingo addresses the challenge of students losing language skills over the summer break. While maintaining language proficiency during the school year is relatively straightforward with classroom support, resources, and peer interaction, it becomes more challenging when students are at home during the summer. Motivation often wanes due to limited access and a lack of incentives. This is a critical issue because the loss of language skills can hinder students when they return to classes in the next semester. Professors typically expect students to continue from where they left off, creating a steep learning curve for those without recent exposure.
To address this problem, we propose developing an online platform with a chatbot to help students practice their language skills. Swarthmore students will have the option to engage in public or private chat rooms, or they can interact with an online chatbot if they prefer or if there are no other users available. To create a secure and familiar environment, access will be restricted to Swarthmore students. Additionally, to enhance motivation, we will introduce achievements and incremental level-ups to encourage regular usage.
This solution stands out because it promotes consistent language skill review. As a web application, it offers accessibility across personal devices and locations. Moreover, the chat format provides practical language practice, surpassing apps that focus solely on vocabulary or grammar. By allowing students to respond to diverse prompts, Swatlingo enables them to apply classroom concepts in real-life situations.

- **Problem:** Students lose language progress over the summer.
- **Importance:** Loss hinders progress in subsequent semesters.
- **Solution:** Chatbot and online messaging platform with incentives.
- **Merits:** Promotes consistent language skill review.

**Developmental Environment**

- **Version Control:** Git (GitHub)
- **Languages:** Python, JavaScript, HTML, CSS
- **IDE:** Visual Studio Code
- **Platform:** Web

**Other Tools, APIs, and Technologies**

- **Proxy:** Nginx
- **WSGI:** Waitress
- **Server:** Flask
- **Database:** MongoDB
- **API:** OpenAI
- **Styling:** Sass
- **Challenges**

Our team faces several challenges in this project. Firstly, some team members lack prior experience in website development, necessitating the acquisition of knowledge in server conceptualization, concurrent user management, and user achievement tracking through external resources.
A significant challenge is the tight time frame of the project. Given its limited duration, we anticipate not being able to implement certain desirable features, such as real-time grammar corrections by the chatbot, multiple achievement screen pages, and support for multiple languages. However, these may be explored as potential extensions if we decide to continue developing Swatlingo beyond the initial phase.

- **No prior website development experience for T and Yana.**
- **Conceptualizing server functionality.**
- **Managing multiple users on the same server.**
- **Implementing a variety of achievements.**

**List of Requirements**

Our web app will provide users with the ability to chat with each other, allowing for practical language practice with other people. We will implement a chatbot for situations when other students are not online or when students prefer practicing their language skills independently. Users will also have access to a main chatroom or the option to create their private chatrooms to interact with friends. Users will have the opportunity to earn achievements based on factors like their frequency of logins. Lastly, access to our web app will be restricted to Swarthmore students to create a familiar and welcoming environment.

- **Allow user-to-user chat**
- **Enable chat with a chatbot**
- **Achievement tracking**
- **Main and private chat rooms**
- **Swarthmore account access**

**Deliverables**

By the end of the semester, we aim to have a usable web app, Swatlingo, accessible to anyone with a Swarthmore email address.

**Timeline and Milestones**

Our project timeline spans 7-8 weeks, starting on October 2nd and concluding by November 29th. By October 5th, we aim to deploy a basic application on a server, even without our core features. By November 9th, we target the delivery of a minimal viable product (MVP), including essential functionality like user-to-user and user-to-chatbot interactions in main and private chatrooms, achievement tracking, and Swarthmore user authentication. By November 24th, we plan to present a fully functional application, which involves refining the website's aesthetics and addressing any remaining miscellaneous features.

- **Project duration:** 7-8 weeks (October 2nd to November 29th)
- **October 5th:** Basic application without core features
- **November 9th:** Implementation of core features (MVP)
- **November 24th:** Usable application state

**Background Information**

- **Mascot:** Phineas, resembling the Duolingo bird
- **Logo:** Feather Sans
- **Body font:** Nunito
