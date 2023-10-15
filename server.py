# Server Py

# Import the Main Server
import os
from flask import Flask, request, render_template, json, jsonify
from dotenv import load_dotenv

# Load env vars from .env file
load_dotenv()

# Initialize Flask App
app = Flask(__name__)

# Grab env vars
app_id = os.getenv("APP_ID")
jungkook_id = os.getenv("JUNGKOOK_ID")
salina_id = os.getenv("SALINA_ID")
dogbot_id = os.getenv("DOGBOT_ID")

# Define routes of the app
@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/chat", methods=["GET", "POST"])
def chat():
    
    if request.method == "GET":
        return render_template("chat.html")
    
    elif request.method == "POST":
        return jsonify({"message": "Simple response for POST Request"})