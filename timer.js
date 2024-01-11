let urlCountdown = "";

// Parse the query parameters from the URL
var urlParams = new URLSearchParams(window.location.search);
var startTimeParam = urlParams.get('startTime');
var secondsParam = urlParams.get('seconds');

// If startTime and seconds parameters are provided, use them. Otherwise, use default values.

if (startTimeParam && secondsParam) {
    var startTime = new Date(startTimeParam);
    var countdownSeconds = parseInt(secondsParam) - Math.floor((new Date() - startTime)/1000);
    startCountdown(startTime, countdownSeconds);
}

function startCountdown(start, seconds) {

    // If a countdown is already running, stop it
    if (countdown) {
        clearInterval(countdown);
    }

    // Set the countdown time in seconds
    var count = seconds;

    // Create elements to display the start time and countdown
    var startTimeElement = document.createElement('p');
    var countdownElement = document.createElement('p');

    document.body.appendChild(startTimeElement);
    startTimeElement.className = 'timer';

    document.body.appendChild(countdownElement);
    countdownElement.className = 'digital-clock';

    // Create a div to hold the QR code
    var qrCodeElement = document.createElement('div');
    document.body.appendChild(qrCodeElement);

    // Display the start time
    startTimeElement.innerText = Math.floor(seconds / 60) + " minute countdown started at: " + start.toLocaleTimeString();

    // Update the countdown every second
    var countdown = setInterval(function() {

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

    urlCountdown = "https://jolly-tree-0cd1be41e.4.azurestaticapps.net?startTime=" + encodeURIComponent(start) + "&seconds=" + encodeURIComponent(seconds);
    // Generate the QR code
    new QRCode(qrCodeElement, {
        text: urlCountdown,
        width: 128,
        height: 128
    });
}

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

document.getElementById('startButton').addEventListener('click', function() {
    var minutes = document.getElementById('minutes').value;
    var seconds = minutes * 60;

    startCountdown(new Date(), seconds);
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        location.href = urlCountdown;
    }
});

