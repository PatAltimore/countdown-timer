let urlCountdown = "";

// Parse the query parameters from the URL
var urlParams = new URLSearchParams(window.location.search);
var startTimeParam = urlParams.get('startTime');
var secondsParam = urlParams.get('seconds');

var startTime;
var countdownSeconds;
var countdown;
var count;



// If startTime and seconds parameters are provided, use them. Otherwise, use default values.

if (startTimeParam && secondsParam) {
    startTime = new Date(startTimeParam);
    countdownSeconds = parseInt(secondsParam) - Math.floor((new Date() - startTime)/1000);
    startCountdown(startTime, countdownSeconds);
}

function startCountdown(start, seconds) {

    var countdownElement = document.getElementById('countdown');
    var qrCodeElement = document.getElementById('qr-code');

    // If a countdown is already running, stop it
    if (countdown) {
        clearInterval(countdown);
    }

    // Set the countdown time in seconds
    count = seconds;

    // Update the countdown every second
    countdown = setInterval(function() {

        var minutes = Math.floor(count / 60);
        var seconds = count % 60;
        countdownElement.innerText = String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
        count--;

        // When the countdown reaches 0, stop the countdown
        if (count < 0) {
            clearInterval(countdown);
            countdownElement.innerText = "Time's up!";
            sendNotification();
        }
    }, 1000);

    urlCountdown = "https://jolly-tree-0cd1be41e.4.azurestaticapps.net?startTime=" + encodeURIComponent(startTime) + "&seconds=" + encodeURIComponent(countdownSeconds);

    // Clear the qr-code element
    while (qrCodeElement.firstChild) {
        qrCodeElement.removeChild(qrCodeElement.firstChild);
    }

    // Generate the QR code
    
    new QRCode(qrCodeElement, {
        text: urlCountdown,
        width: 128,
        height: 128
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startButton').addEventListener('click', function() {
        var minutes = document.getElementById('minutes').value;
        startTime = new Date();
        countdownSeconds = minutes * 60;

        startCountdown(startTime, countdownSeconds);
    });
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        count = count - Math.floor((new Date() - startTime)/1000);
    }
});

function sendNotification() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Check if permission is already granted
    else if (Notification.permission === "granted") {
        var notification = new Notification("Time's up!");
    }

    // Otherwise, ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification("Time's up!");
            }
        });
    }
}

