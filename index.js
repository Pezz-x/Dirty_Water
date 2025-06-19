import "dotenv/config";
import { createApiKey } from "@esri/arcgis-rest-developer-credentials";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { moveItem, getSelf } from "@esri/arcgis-rest-portal";

// Requiring module

(async () => {
    const authentication = await ArcGISIdentityManager.signIn({
        username: process.env.ARCGIS_USERNAME,
        password: process.env.ARCGIS_PASSWORD,
    });

    const orgUrl = await getSelf({ authentication: authentication });

    const newKey = await createApiKey({
        title: `API key ${Math.floor(Date.now() / 1000)}`,
        description:
            "API Key generated with ArcGIS REST JS with spatial analysis and basemap privileges",
        tags: ["api key", "basemaps", "spatial analysis", "authentication"],

        privileges: [
            "premium:user:spatialanalysis",
            "premium:user:basemaps", // Not available for ArcGIS Enterprise
        ],

        generateToken1: true,

        apiToken1ExpirationDate: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 30
        ), // 30 days

        authentication: authentication,
    });

    console.log(`\nNew API key created: ${newKey.accessToken1}`);
    console.log(
        `\nView item: https://${orgUrl.urlKey}.maps.arcgis.com/home/item.html?id=${newKey.itemId}`
    );

    const moved = await moveItem({
        itemId: newKey.itemId,
        folderId: "assets/projectAuthentication",
        authentication: authentication,
    });

    console.log(`\nItem moved ${JSON.stringify(moved)}`);
})();

function infoLayer(Map, MapView, FeatureLayer) {
    const map = new Map({
        basemap: "streets-navigation-vector", // Use a valid ArcGIS basemap
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-2, 54],
        zoom: 6,
    });

    const featureLayer = new FeatureLayer({
        url: "https://services-eu1.arcgis.com/OMdMOtfhATJPcHe3/arcgis/rest/services/NEH_outlets_PROD/FeatureServer/0",
        outFields: [
            "statusStart",
            "latestEventStart",
            "latestEventEnd",
            "receivingWaterCourse",
            "lastUpdated",
            "ID",
            "status",
            "longitude",
            "latitude",
        ],
        popupTemplate: {
            title: "Outlet ID: {ID}",
            content: `
                <b>Status:</b> {status}<br>
                <b>Status Start:</b> {statusStart}<br>
                <b>Latest Event Start:</b> {latestEventStart}<br>
                <b>Latest Event End:</b> {latestEventEnd}<br>
                <b>Receiving Water Course:</b> {receivingWaterCourse}<br>
                <b>Last Updated:</b> {lastUpdated}<br>
                <b>Longitude:</b> {longitude}<br>
                <b>Latitude:</b> {latitude}
            `,
        },
    });
    map.add(featureLayer);

    // Event listener for clicking a feature
    view.on("click", function (event) {
        view.hitTest(event).then(function (response) {
            const results = response.results;
            if (results.length > 0) {
                const graphic = results.filter(
                    (result) => result.graphic.layer === featureLayer
                )[0].graphic;
                view.popup.open({
                    features: [graphic],
                    location: event.mapPoint,
                });
            }
        });
    });
}
