// Create elements to display the start time and countdown
var startTimeElement = document.createElement('p');
var countdownElement = document.createElement('p');

document.body.appendChild(startTimeElement);
document.body.appendChild(countdownElement);

// Create the restart link
var link = document.createElement('a');
link.href = "#";
link.innerText = "Offset countdown";
link.onclick = function() {
    // Format the startTime and seconds parameters
    var startTimeParam = encodeURIComponent(startTime.toISOString());
    var secondsParam = encodeURIComponent(seconds);

    // Change the window location to make an HTTP request to the index.html page with the parameters
    window.location.href = 'index.html?startTime=' + startTimeParam + '&seconds=' + secondsParam;

    return false; // Prevent the link from navigating to the href
};
document.body.appendChild(link);

// Create a div to hold the QR code
var qrCodeElement = document.createElement('div');
document.body.appendChild(qrCodeElement);

// Generate the QR code
new QRCode(qrCodeElement, {
    text: window.location.href,
    width: 128,
    height: 128
});



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

    // Display the start time
    startTimeElement.innerText = "Countdown started at: " + new Date(start).toLocaleTimeString();

    // Update the countdown every second
    var countdown = setInterval(function() {

        var minutes = Math.floor(count / 60);
        var seconds = count % 60;
        countdownElement.innerText = "Time remaining: " + minutes + " minutes " + seconds + " seconds";
        count--;

        // When the countdown reaches 0, stop the countdown
        if (count < 0) {
            clearInterval(countdown);
            countdownElement.innerText = "Time's up!";
            sendNotification();
        }
    }, 1000);
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

