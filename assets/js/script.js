async function initMap() {
  // Centre on Cornwall
  const cornwallCenter = { lat: 50.4108, lng: -5.0810 };

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: cornwallCenter,
  });

  try {
    const response = await fetch('https://services-eu1.arcgis.com/OMdMOtfhATJPcHe3/arcgis/rest/services/NEH_outlets_PROD/FeatureServer/0/query?where=1%3D1&outFields=latestEventStart,latestEventEnd,receivingWaterCourse,lastUpdated,ID,status,latitude,statusStart,longitude&outSR=4326&f=json');
    const data = await response.json();

    const features = data.features;

    features.forEach((feature) => {
      const attrs = feature.attributes;
      const lat = parseFloat(attrs.latitude);
      const lng = parseFloat(attrs.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          title: `ID: ${attrs.ID}\nStatus: ${attrs.status}`
        });
      }
    });
  } catch (error) {
    console.error('Error fetching ArcGIS data:', error);
  }
}
