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

console.log("success");
