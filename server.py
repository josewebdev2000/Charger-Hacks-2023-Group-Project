# Server Py

# Import the Main Server
import os, requests
from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv

# Load env vars from .env file
load_dotenv()

# Initialize Flask App
app = Flask(__name__)

# Grab env vars
api_url = os.getenv("API_URL")
app_id = os.getenv("APP_ID")
jungkook_id = os.getenv("JUNGKOOK_ID")
salina_id = os.getenv("SALINA_ID")
dogbot_id = os.getenv("DOGBOT_ID")

# Save chatbot names
chatbot_names = ("salina", "jung kook", "dog bot")
chatbot_names_n_id = {
    "salina" : salina_id,
    "jung kook": jungkook_id,
    "dog bot": dogbot_id
}

# Custom reusable functions
def custom_response(res_data, http_code):
    """Produce your own JSON response by providing JSON data along with an associated HTTP code"""
    
    res = jsonify(res_data)
    res.status_code = http_code
    return res

def custom_error_data(for_bot = True):
    """Return a dict that contains the JSON to return to the front-end every time an error arises."""
    
    if for_bot:
        return {"error": "Tranquil AI Bot Could Not Respond"}
    
    else:
        return {"error": "Tranquil AI Client Error"}

# Define routes of the app
@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/chat", methods=["GET", "POST"])
def chat():
    
    if request.method == "GET":
        return render_template("chat.html")
    
    elif request.method == "POST":
        
        # If request type is not json, return custom error response
        if not request.is_json:
            return custom_response(custom_error_data(False), 400)
        
        # Grab JSON request from the user
        user_msg_request = request.json
        
        # Return early error response if message is empty
        user_msg = user_msg_request.get("message", "")
        
        if len(user_msg) < 1:
            return custom_response(custom_error_data(), 400)
        
        # Grab name of bot
        bot_name = user_msg_request.get("botName", "")
        
        # Return 400 Error if the Bot Name is not present
        if not bot_name in chatbot_names:
            return custom_response(custom_error_data(), 400)
        
        # Associate the Bot Name to the Bot's ID
        bot_id = chatbot_names_n_id.get(bot_name.lower())
        
        # Prepare JSON request for Bot Libre Web API
        request_for_bot_api = {
            "application": app_id,
            "instance": bot_id,
            "message": user_msg
        }
        
        # Send the HTTP POST request to the API
        response_from_bot_api = requests.post(api_url, json=request_for_bot_api)
        
        # If the request was not successful send an error response
        if not response_from_bot_api.status_code == 200:
            return custom_response(custom_error_data(), 400)
        
        # Grab the bot's message
        bot_msg = response_from_bot_api.json().get("message")
        
        # Send the bot's message back to the user
        return custom_response({"message": bot_msg}, 200)
    
    # For any other request, return custom error
    else:
        return custom_response(custom_error_data(False), 400)