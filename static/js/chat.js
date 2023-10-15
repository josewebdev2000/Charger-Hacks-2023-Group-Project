// Define constants to be use throughout this file
const chatBotStates = ["Awaiting", "Writing", "Responded"];
const chatBotPics = {
    "salina" : "/static/img/salina-profile-pic.png",
    "jung kook": "/static/img/jungkook.jpeg",
    "dog bot": "/static/img/dog-bot.jpeg"
};

const relevantClassesForInteractivity = {
    "botShower": ["bot-pic", "bot-name", "bot-chat-status", "bot-msg-preview", "bot-responses"],
    "botChats": ["user-msg", "user-real-msg", "bot-msg","bot-chat-pic" ,"bot-real-msg"]
};

const relevantIsForInteractivity = {
    "botShower": ["bot-real-list", "salina-shower", "jung-kook-shower", "dog-bot-shower"],
    "botChats": ["chat-container", "user-msg-container", "user-msg-input", "user-submit-msg"]
};

// Interactivity for Chat Page
$(document).ready(function() {

    // Grab Shower for Salina
    const salinaShowerBotResponses = $("#salina-shower span.bot-responses");

    // Hide chat responses initially
    salinaShowerBotResponses.hide();

    // Grab user msg button
    const userMsgBtn = $("#user-submit-msg");

    // Send user Msg Event Listener
    userMsgBtn.on("click", sendUserMsg);
    
});

function sendUserMsg(e)
{
    // Prevent Default Link Behaviour
    e.preventDefault();

    // Grab the value from user message input
    const userMsgInputVal = $("#user-msg-input").val();

    // If the value is early return and do nothing
    if (userMsgInputVal.length == 0)
    {
        return;
    }

    // Build OBJ for user chat msg
    const userMsgObj = {
        chatter: "user",
        message: userMsgInputVal
    };

    // Add user msg to the bot chat container
    buildNewMsgChat(userMsgObj);

    // Send AJAX request to server with the bot name and user message
    /*$.ajax({
        url: "http://localhost:5000/chat",
        type: "POST",
        data: JSON.stringify({
            "botName": "salina",
            "message": userMsgInputVal
        }),
        beforeSend: function() {},
        success: function(response) {
            // Grab bot message
            const { message } = response;

            // Add bot msg to the bot chat container
            const botMsgObj = {
                chatter: "bot",
                message: message
            };

            // Add chat to the container
            buildNewMsgChat(botMsgObj);
        },
        error: function() {

        },
        complete: function() {}
    });*/

    // Define the request options
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
            botName: "salina",
            message: userMsgInputVal,
        }),
    };

    // Perform the POST request using the fetch function
    fetch("http://localhost:5000/chat", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Handle the successful response data
            const { message } = data;
            const botMsgObj = {
                chatter: "bot",
                message: message,
            };
            buildNewMsgChat(botMsgObj);
        })
        .catch((error) => {
            // Handle any errors that occur during the request
            console.error("Request error: " + error.message);
        });


}


function buildNewMsgChat(contentObj) 
{
    // Grab the actual chat container
    const chatContainer = $("#chat-real-container");

    // Grab chatter and message from contentObj
    const { chatter, message } = contentObj;

    // Build new Chat HTML
    let newChatHTML = "";

    if (chatter == "user") {
        // Build HTML of new chat
        newChatHTML = `<div class="user-msg d-flex flex-row justify-content-start"><img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp" alt="avatar 1"><div><p class="small p-2 ms-3 mb-1 rounded-3 user-real-msg">${message}</p></div></div>`;
    } else {
        newChatHTML = `<div class="bot-msg d-flex flex-row justify-content-end"><div><p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary bot-real-msg">${message}</p></div><img class="bot-chat-pic" src="/static/img/salina-profile-pic.png" alt="avatar 1"></div>`;
    }

    // Build new Chat based on newChatHTML
    const newChat = $(newChatHTML);

    // Append the new Chat to the end of chatContainer
    chatContainer.append(newChat);
}
