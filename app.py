# from waitress import serve
import ssl, socket, openai, datetime

# Set Up ChatGPT Connection
from crypt import methods
from operator import methodcaller
from time import time
from xml.etree.ElementTree import tostring

# Set Up Flask App
from flask import Flask, render_template, redirect, request, session, jsonify
from flask_cors import CORS

# PIP INSTALL FLASK-SOCKETIO
from flask_socketio import SocketIO, join_room

# Pymongo
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

#This is for private room intialization
counter = 0
@app.route('/get_counter')
def get_counter():
    global counter
    counter += 1
    return str(counter)

@app.route('/get_counterSimple')
def get_counterSimple():
    global counter
    return str(counter)

#keyValueJoiners. Counting how many times each room has been joined...
#in local storage, which is good because should reset each time the server refreshes

Dict = {}
#Dict[0] = 0
# Route to retrieve the counter for a given key
@app.route('/initializeUpdate_counterJoiner/<key>', methods = ['POST'])
async def initializeUpdate_counterJoiner(key):
    # Return the current counter value (defaulting to 0 if the key is not found)
    print(key)
    global Dict
    
    if int(key) in Dict:
        Dict[int(key)] += 1
    else:
        Dict[int(key)] = 1
    
    print(str(Dict[int(key)]))
    return str(Dict[int(key)])

# Route to retrieve the counter for a given key
@app.route('/retrieve_counterJoiner/<key>', methods = ['POST'])
def retrieve_counterJoiner(key):
    # Return the current counter value (defaulting to 0 if the key is not found)
    global Dict
    return str(Dict[int(key)])


@socketio.on("join")
def handle_join(room):
    join_room(room)
    print(f"User joined " + room)
    if room != "default":
        socketio.emit("roomCreated", room)
        print(f"emited join new private room created message")


@socketio.on("message")
def handle_message(message):
    socketio.emit("message", message)

@socketio.on('messagePrivateRoom')
def handle_message_private(message, room):
    print(f"attempting private messaging" + room)
    socketio.emit('messagePrivateRoom', [message, room])


# MongoDB setup
uri = "mongodb+srv://swatlingo:rlkG9MCGLgB8mnYi@cluster0.daztqup.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
client = MongoClient(uri, connect=False)
db = client.all_users
collection = db.user

# INSTALL FLASK ASYNC TOO!! `pip install 'Flask[async]`
openai.api_key = "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"
msgs = [
    {
        "role": "system",
        "content": "Keep your responses to within 50 words. You are a language tutor called Phineas helping a student learn a foreign language. Give the student simple tasks to practice their foreign language skills. For example, you could ask them to translate a sentence into their foreign language. Always provide the student with feedback on their performance. Always correct any mistakes they make. Do not repeat any questions. Here are some examples of tasks that you could give the student: Translate the following sentence into your foreign language: 'My name is Phineas.' Ask me a question in the language. Tell me what you did today in the language.",
    }
]


class OpenAIError(Exception):
    pass


# Webpage Endpoints
@app.route("/login", methods=["POST"])
def login():
    try:
        email = request.json.get("email")

        # Check if the email already exists in the database
        existing_user = collection.find_one({"username": email})
        redirect_url = "/home"  # Replace with your desired URL

        if existing_user:
            # Email already exists, return an error response
            return jsonify(
                {"message": "Email in MongoDB already!", "redirectURL": redirect_url}
            )
        else:
            # Email is unique, insert the new user
            post_data = {
                "username": email,
                "email": email,
                "time_studied": 0,
                "chats_sent": 0,
                "streak": 0,
                "made_account": True,
                "chat_with_chatbot": False,
                "chat_in_public": False,
                "chat_in_private": False,
                "opened_settings": False,
                # "witnessed_evil_phineas": False,
                "last_access": str(datetime.date.today()),
            }
            collection.insert_one(post_data)
            print(f"Inserted new user: {post_data}")
            return jsonify(
                {
                    "message": "You can use your email to log in next time :)",
                    "redirectURL": redirect_url,
                }
            )
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/updateStreak", methods=["PUT"])
def update_streak():
    try:
        username = request.json.get("userEmail")

        # Check if the username already exists in the database
        existing_user = collection.find_one({"username": username})
        print(existing_user)

        if existing_user:
            # Check the last access date from the session
            last_access = existing_user.get("last_access", None)
            today = str(datetime.date.today())

            if not last_access or last_access != today:
                # Increment the streak if the user logs in after a day
                existing_user["streak"] += 1
                existing_user["last_access"] = today
                # Update the streak in the database
                collection.update_one(
                    {"username": username},
                    {"$set": {"streak": existing_user["streak"], "last_access": today}},
                )
            return jsonify({"message": "Streak updated successfully."})
        else:
            # User not found, return an error response
            return jsonify({"message": "User not found."}), 404
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500
    
@app.route("/updateChatbotAchievement", methods=["PUT"])
def update_chatbot_achievement():
    try:
        username = request.json.get("userEmail")

        # Check if the username already exists in the database
        existing_user = collection.find_one({"username": username})
        print(existing_user)

        if existing_user:
            # Check the last access date from the session
            chatted_with_chatbot = existing_user.get("chat_with_chatbot", None)
            collection.update_one(
                {"username": username},
                {"$set": {"chat_with_chatbot": True}},
            )
            return jsonify({"message": "Chatbot achievement updated successfully."})
        else:
            # User not found, return an error response
            return jsonify({"message": "User not found."}), 404
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500

@app.route("/updatePublicChatAchievement", methods=["PUT"])
def updatePublicChatAchievement():
    try:
        username = request.json.get("userEmail")

        # Check if the username already exists in the database
        existing_user = collection.find_one({"username": username})
        print(existing_user)

        if existing_user:
            collection.update_one(
                {"username": username},
                {"$set": {"chat_in_public": True}},
            )
            return jsonify({"message": "Public chat achievement updated successfully."})
        else:
            # User not found, return an error response
            return jsonify({"message": "User not found."}), 404
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500
    
@app.route("/updatePrivateChatAchievement", methods=["PUT"])
def updatePrivateChatAchievement():
    try:
        username = request.json.get("userEmail")

        # Check if the username already exists in the database
        existing_user = collection.find_one({"username": username})
        print(existing_user)

        if existing_user:
            collection.update_one(
                {"username": username},
                {"$set": {"chat_in_private": True}},
            )
            return jsonify({"message": "Public chat achievement updated successfully."})
        else:
            # User not found, return an error response
            return jsonify({"message": "User not found."}), 404
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500

def get_all_users():
    try:
        users = list(collection.find({}))
        return jsonify(users)
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/", methods=["GET"])
def index():
    server_url = request.base_url
    return render_template("login.html", server_url=server_url)


@app.route("/home", methods=["GET"])
def home():
    return render_template("home.html")


@app.route("/settings", methods=["GET"])
def settings():
    return render_template("settings.html")

@app.route("/update-username", methods=["POST"])
def update_username():
    try:
        user_email = request.json.get("email")
        new_username = request.json.get("newUsername")

        # Check if the user exists in the database
        user = collection.find_one({"username": user_email})

        if user:
            # Update the username in the database
            collection.update_one(
                {"username": user_email},
                {"$set": {"username": new_username}},
            )

            return jsonify({"success": True, "message": "Username updated successfully"})
        else:
            return jsonify({"success": False, "message": "User not found"}), 404

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/chatbot", methods=["GET"])
def chatbot():
    return render_template("chatbot.html")

@app.route("/public", methods=["GET"])
def public():
    return render_template("public.html")


@app.route("/private", methods=["GET"])
def private():
    return render_template("private.html")


@app.route("/achievements", methods=["GET"])
def achievements():
    return render_template("achievements2.html")


@app.route("/about", methods=["GET"])
def about():
    return render_template("about.html")


# ChatGPT Endpoints
@app.route("/sendMessage/<userInput>", methods=["POST", "PUT"])
async def sendToGPT3(userInput):
    response = await sendMessage2(userInput)
    print(response)
    return response

async def sendMessage2(msg):
    try:
        # Sanitize input
        msg.replace("<", "&lt;").replace(">", "&gt;")
        # Append the user's message to the conversation, and truncate if needed
        msgs.append({"role": "user", "content": msg})

        ###TRYING TO ADD TO CHATS SENT###
        #existing_user = collection.find_one({"username": username})
        #print(existing_user)

        #if existing_user:
        #    existing_user["chats_sent"] += 1
        #    collection.update_one(
        #        {"username": username},
        #        {"$set": {"chats_sent": existing_user["chats_sent"]}},
        #    )
    
        ###END TEST###
        chat = openai.chat.completions.create(model="gpt-3.5-turbo", messages=msgs)
    except OpenAIError as error:
        if len(msgs) > 1:
            # Remove the oldest message to make room for the new message
            msgs.pop(1)
        print("oopsies something's up with chatgpt:", error)
        return error

    response = chat.choices[0].message.content
    msgs.append({"role": "assistant", "content": response})
    return response

@app.route("/updateChatsSent", methods=["PUT"])
def updateChatsSent():
    try:
        username = request.json.get("userEmail")

        # Check if the username already exists in the database
        existing_user = collection.find_one({"username": username})
        print(existing_user)

        if existing_user:
            chats_sent = existing_user.get("chats_sent", None)
            existing_user["chats_sent"] += 1
            # Update the streak in the database
            collection.update_one(
                {"username": username},
                {"$set": {"chats_sent": existing_user["chats_sent"]}},
            )
            return jsonify({"message": "Chats sent updated successfully."})
        else:
            # User not found, return an error response
            return jsonify({"message": "User not found."}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/get_time_studied", methods=["GET"])
def get_time_studied():
    try:
        user_email = request.args.get("email")
        # Check if the user exists in the database
        user = collection.find_one({"username": user_email})
        if user:
            time_spent = user.get("time_spent", 0)
            return jsonify({"success": True, "time_spent": time_spent})
        else:
            return jsonify({"success": False, "message": "User not found"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})


@app.route("/get_chats_sent", methods=["GET"])
def get_chats_sent():
    try:
        user_email = request.args.get("email")

        # Check if the user exists in the database
        user = collection.find_one({"username": user_email})
        if user:
            chats_sent = user.get("chats_sent", 0)
            return jsonify({"success": True, "chats_sent": chats_sent})
        else:
            return jsonify({"success": False, "message": "User not found"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})


@app.route("/get_streak", methods=["GET"])
def get_streak():
    try:
        user_email = request.args.get("email")
        print(user_email)

        # Check if the user exists in the database
        user = collection.find_one({"username": user_email})
        if user:
            streak = user.get("streak", 0)
            return jsonify({"success": True, "streak": streak})
        else:
            return jsonify({"success": False, "message": "User not found"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route("/get_other_achievements", methods=["GET"])
def get_other_achievements():
    try:
        user_email = request.args.get("email")

        # Check if the user exists in the database
        user = collection.find_one({"username": user_email})
        if user:
            made_account = user.get("made_account", False)
            chat_with_chatbot = user.get("chat_with_chatbot", False)
            chat_in_public = user.get("chat_in_public", False)
            chat_in_private = user.get("chat_in_private", False)
            return jsonify({"success": True, "made_account": made_account, "chat_with_chatbot": chat_with_chatbot,\
                "chat_in_public": chat_in_public, "chat_in_private": chat_in_private})
        else:
            return jsonify({"success": False, "message": "User not found"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route("/updateMinutesSpent", methods=["POST"])
def updateMinutesSpent():
    try:
        username = request.json.get("userEmail")

        # Check if the username already exists in the database
        existing_user = collection.find_one({"username": username})
        print(existing_user)

        if existing_user:
            # Check the last access date from the session
            existing_user["time_spent"] += 1
            # Update the streak in the database
            collection.update_one(
                {"username": username},
                {"$set": {"time_spent": existing_user["time_spent"]}},
            )
            return jsonify({"message": "Streak updated successfully."})
        else:
            # User not found, return an error response
            return jsonify({"message": "User not found."}), 404
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500
    
if __name__ == "__main__":
    # path = '/etc/letsencrypt/live/swe-swatlingo.sccs.swarthmore.edu/'
    ssl_context = ('fullchain.pem', 'privkey.pem')
    fullchain = 'fullchain.pem'
    privkey = 'privkey.pem'
    # app.run("0.0.0.0", port=1234, debug=False, ssl_context=context)
    os.system(f'gunicorn -w 4 -b 0.0.0.0:1234 -k gevent --certfile={fullchain} --keyfile={privkey} app:app')
    # serve(app, port=8080)
    # serve(app, host='0.0.0.0', port=1234)
    # ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    # ssl_context.load_cert_chain('fullchain.pem', 'privkey.pem')
    # with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        # sock.bind(('0.0.0.0', 8080))
        # sock.listen()
        # serve(app, url_scheme='https', _sock=sock, _ssl_context=ssl_context)
