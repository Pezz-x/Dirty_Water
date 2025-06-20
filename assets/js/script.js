async function initMap() {
    // Centre on Cornwall
    const cornwallCenter = { lat: 50.4108, lng: -5.081 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
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
                    color = "grey";
                } else if (status === 0) {
                    color = "green";
                } else if (status === 1) {
                    color = "red";
                } else {
                    color = "black";
                }

                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: `ID: ${attrs.ID}\nStatus: ${attrs.status}`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: color,
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "black",
                    },
                });

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

                    infoWindow.setContent(`
                      <div>
                        <b>Outlet ID:</b> ${attrs.ID}<br>
                        <b>Status:</b> ${attrs.status}<br>
                        <b>Status Start:</b> ${formatUTC(attrs.statusStart)}<br>
                        <b>Latest Event Start:</b> ${formatUTC(
                            attrs.latestEventStart
                        )}<br>
                        <b>Latest Event End:</b> ${formatUTC(
                            attrs.latestEventEnd
                        )}<br>
                        <b>Receiving Water Course:</b> ${
                            attrs.receivingWaterCourse
                        }<br>
                        <b>Last Updated:</b> ${formatUTC(attrs.lastUpdated)}<br>
                        <b>Longitude:</b> ${attrs.longitude}<br>
                        <b>Latitude:</b> ${attrs.latitude}
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
