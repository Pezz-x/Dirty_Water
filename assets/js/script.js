async function initMap() {
    // Centre on Cornwall
    const cornwallCenter = { lat: 50.4108, lng: -5.081 };

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: cornwallCenter,
  });

  try {
    const response = await fetch('https://services-eu1.arcgis.com/OMdMOtfhATJPcHe3/arcgis/rest/services/NEH_outlets_PROD/FeatureServer/0/query?where=1%3D1&outFields=latestEventStart,latestEventEnd,receivingWaterCourse,lastUpdated,ID,status,latitude,statusStart,longitude&outSR=4326&f=json');
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
                    color = "grey";
                } else if (status === 0) {
                    color = "green";
                } else if (status === 1) {
                    color = "red";
                } else {
                    color = "black";
                }

        new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          title: `ID: ${attrs.ID}\nStatus: ${attrs.status}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: 'black'
          }
        });
      }
    });
  } catch (error) {
    console.error('Error fetching ArcGIS data:', error);
  }
}

// Tidal Events Data

// tide.js

const API_KEY = '53357c40c2554a918f8580389aeed453'; // your key
const STATION_ID = '0546'; // Newquay
const API_URL = `https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/${STATION_ID}/TidalEvents?duration=1`; // get today only
const nextTide = document.getElementById('next-tide');
const tideAfterNext = document.getElementById('tide-after-next');
const tideStatus = document.getElementById('tide-status');

// Utility: Get current ISO date string like '2025-06-18'
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Utility: Format time nicely
function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getTideDirection(nextTideType) {
  return nextTideType === "HighWater" ? "Tide coming in" : "Tide going out";
}

async function loadTideData() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Ocp-Apim-Subscription-Key': API_KEY
      }
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();

    // Get only events for today
    const today = getTodayDate();
    const todayEvents = data.filter(event => event.DateTime.startsWith(today));

    // Get current time
    const now = new Date();

    // Filter events that are still upcoming today
    const upcoming = todayEvents.filter(event => new Date(event.DateTime) > now);

    if (upcoming.length === 0) {
      nextTide.textContent = "No upcoming tide events for today.";
      tideAfterNext.textContent = "No upcoming tide events for today.";
      tideStatus.textContent = "No upcoming tide events for today.";
      return;
    }

    // Get the next 2 tide events
    const nextTwo = upcoming.slice(0, 2);

    // Determine if tide is coming in or out
    const direction = getTideDirection(nextTwo[0].EventType);

    // Display them
      tideStatus.innerHTML = `<p><strong>${direction}</strong></p>`
      nextTide.innerHTML = `<p><strong>${nextTwo[0].EventType === "HighWater" ? "High Tide" : "Low Tide"}</strong> at ${formatTime(nextTwo[0].DateTime)} (${nextTwo[0].Height.toFixed(2)}m)</p>`
      tideAfterNext.innerHTML = `<p><strong>${nextTwo[1].EventType === "HighWater" ? "High Tide" : "Low Tide"}</strong> at ${formatTime(nextTwo[1].DateTime)} (${nextTwo[1].Height.toFixed(2)}m)</p>`


  } catch (error) {
    document.getElementById('tideStatus').textContent = "Error loading tide data: " + error.message;
  }
}

// Run the function
loadTideData();

