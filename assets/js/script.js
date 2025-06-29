async function initMap() {
    // Centre on Cornwall
    const cornwallCenter = { lat: 50.4108, lng: -5.081 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
        streetViewControl: false,
        center: cornwallCenter,
    });

    try {
        const response = await fetch(
            "https://services-eu1.arcgis.com/OMdMOtfhATJPcHe3/arcgis/rest/services/NEH_outlets_PROD/FeatureServer/0/query?where=1%3D1&outFields=latestEventStart,latestEventEnd,receivingWaterCourse,lastUpdated,ID,status,latitude,statusStart,longitude&outSR=4326&f=json"
        );
        const data = await response.json();

        const features = data.features;
        const infoWindow = new google.maps.InfoWindow();

        features.forEach((feature) => {
            const attrs = feature.attributes;
            const lat = parseFloat(attrs.latitude);
            const lng = parseFloat(attrs.longitude);
            const status = parseInt(attrs.status);

            if (!isNaN(lat) && !isNaN(lng)) {
                let color;
                if (status === -1) {
                    color = "#8F8F94";
                } else if (status === 0) {
                    color = `#00FF60`;
                } else if (status === 1) {
                    color = "#EA0C00";
                } else {
                    color = "#000000";
                }

                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: `ID: ${attrs.ID}\nStatus: ${attrs.status}`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: color,
                        fillOpacity: 0.8,
                        strokeWeight: 0.5,
                        strokeColor: "black",
                    },
                });

                if (status === 1) {
                    let growing = true;
                    let scale = 8;
                    setInterval(() => {
                        if (growing) {
                            scale += 0.5;
                            if (scale >= 15) growing = false;
                        } else {
                            scale -= 0.5;
                            if (scale <= 8) growing = true;
                        }
                        marker.setIcon({
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: scale,
                            fillColor: color,
                            fillOpacity: 0.8,
                            strokeWeight: 0.5,
                            strokeColor: "black",
                        });
                    }, 50);
                }

                marker.addListener("click", () => {
                    function formatUTC(utcString) {
                        if (!utcString) return "N/A";
                        const date = new Date(utcString);
                        if (isNaN(date)) return utcString;
                        const pad = (n) => n.toString().padStart(2, "0");
                        return `${pad(date.getHours())}:${pad(
                            date.getMinutes()
                        )}:${pad(date.getSeconds())} ${pad(
                            date.getDate()
                        )}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
                    }
                    /* convert current status of pumps from type int to string */
                    function currentStatus(status) {
                        status = parseInt(status);
                        if (status === -1) return "Offline";
                        if (status === 0) return "Pump Off";
                        if (status === 1) return "Pump On";
                        return "Unknown";
                    }

                    infoWindow.setContent(`
                            <div class="custom-infowindow">
                                <b>Status:</b> ${currentStatus(
                                    attrs.status
                                )}<br>
                                <b>Latest Release Started:</b> ${formatUTC(
                                    attrs.latestEventStart
                                )}<br>
                                <b>Latest Release Stopped:</b> ${formatUTC(
                                    attrs.latestEventEnd
                                )}<br>
                                <b>Receiving Water Course:</b> ${
                                    attrs.receivingWaterCourse
                                }<br>
                                <b>Last Updated:</b> ${formatUTC(
                                    attrs.lastUpdated
                                )}<br>
                            </div>
                        `);
                    infoWindow.open(map, marker);
                });
            }
        });
    } catch (error) {
        console.error("Error fetching ArcGIS data:", error);
    }
}
// Remove the duplicate initPopUp function and the <script> tag from here.
// The Google Maps API script should only use the callback parameter to call initMap.

// Tidal Events Data

// tide.js

const nextTide = document.getElementById("next-tide");
const tideAfterNext = document.getElementById("tide-after-next");
const tideStatus = document.getElementById("tide-status");

// Utility: Get current ISO date string like '2025-06-18'
function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

// Utility: Format time nicely
function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getTideDirection(nextTideType) {
    return nextTideType === "HighWater" ? "Tide coming in" : "Tide going out";
}

async function loadTideData() {
    // Fetching JSON.
    try {
        const response = await fetch("assets/js/water_level_data.json");

        if (!response.ok)
            throw new Error(`Failed to fetch tide data: ${response.status}`);

        const data = await response.json();

        // Get current time
        const now = new Date();

        // Filter events that are still upcoming
        const upcoming = data.filter((event) => new Date(event.DateTime) > now);

        // Get the next 2 tide events
        const nextTwo = upcoming.slice(0, 2);

        // Determine if tide is coming in or out
        const direction = getTideDirection(nextTwo[0].EventType);

        // Calling function to change color of tideStatus div
        toggleDivColor(nextTwo[0].EventType);

        // Display them
        tideStatus.innerHTML = `<p class="remove-mb"><strong>${direction}</strong></p>`;
        nextTide.innerHTML = `<p class="remove-mb"><strong>${
            nextTwo[0].EventType === "HighWater" ? "High Tide" : "Low Tide"
        }</strong> at ${formatTime(
            nextTwo[0].DateTime
        )} (${nextTwo[0].Height.toFixed(2)}m)</p>`;
        tideAfterNext.innerHTML = `<p class="remove-mb"><strong>${
            nextTwo[1].EventType === "HighWater" ? "High Tide" : "Low Tide"
        }</strong> at ${formatTime(
            nextTwo[1].DateTime
        )} (${nextTwo[1].Height.toFixed(2)}m)</p>`;
    } catch (error) {
        tideStatus.innerHTML = "Error loading tide data";
    }
}

// Run the function
loadTideData();

// function to change color of tideStatus div
function toggleDivColor(tideEvent) {
  if (tideEvent === "HighWater") {
    tideStatus.style.backgroundColor = "#ffc107"; // Tide incoming = red
  }
  else if (tideEvent === "LowWater") {
    tideStatus.style.backgroundColor = "#0fbe0fd2"; // Tide outgoing = green
  }
  else {
    tideStatus.style.backgroundColor = "#ebeae8"; // If unable to retrieve tide data = white
  }
};

document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
        const form = event.target;
        const nameInput = form.querySelector('[id="contact-name"]');
        const userName = nameInput ? nameInput.value : "there";
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault(); // Prevent actual submission for demo
            const messageDiv = document.getElementById("contact-message");
            if (messageDiv) {
                messageDiv.textContent = `Thanks for your message, ${userName}! We'll get right back to you.`;
                messageDiv.style.display = "block";
            } else {
                alert(
                    `Thanks ${userName}, for your message! We'll get back to you ASAP.`
                );
            }
            form.reset();
            form.classList.remove("was-validated");
            return;
        }
        form.classList.add("was-validated");
    });
