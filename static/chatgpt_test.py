import openai  # You will need to pip3 install this python module
import os

openai.api_key = "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"
msgs = [{"role": "system", "content": "You are a intelligent assistant."}]


# This is the code you would call to send a message from your
# server to ChatGPT's server.  It returns ChatGPT's response
# as a string value.s
def sendMessage(msg):
    if msg:
        msgs.append({"role": "user", "content": msg})
        chat = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=msgs)
    response = chat.choices[0].message.content
    msgs.append({"role": "assistant", "content": response})
    return response


# This is just used to test the sendMessage function above.
while True:
    msg = input("User : ")
    if msg:
        response = sendMessage(msg)
        print("ChatGPT : " + response)
