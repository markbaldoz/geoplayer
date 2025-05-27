var icons = {
    default_marker : 'fa-solid fa-location-dot',
    video          : 'fa-solid fa-video'
};



/*
|------------------------------------------------------------------
|   TRACK CALCULATIONS
|------------------------------------------------------------------
*/
async function readElevation(videoTime, bbox) {


    const wcsUrl = new URL("https://prdp-ggu-geoserver.da.gov.ph/geoserver/ggu/wcs");

    wcsUrl.searchParams.set("service", "WCS");
    wcsUrl.searchParams.set("version", "2.0.1");
    wcsUrl.searchParams.set("request", "GetCoverage");
    // wcsUrl.searchParams.set("coverageId", "PH_DEM");
    wcsUrl.searchParams.set("coverageId", "PH_DTM_5m");
    wcsUrl.searchParams.set("format", "image/tiff");

    // Set bounding box to subset
    wcsUrl.searchParams.append("subset", `Long(${bbox[0]},${bbox[2]})`);
    wcsUrl.searchParams.append("subset", `Lat(${bbox[1]},${bbox[3]})`);
    wcsUrl.searchParams.append("crs", `http://www.opengis.net/def/crs/EPSG/0/4326`);
    
    
    const response = await fetch(wcsUrl);
    
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();

    // donwloadTiff(arrayBuffer)
    
  
    const rasters = await image.readRasters();
    const raster = rasters[0];
  
    // const [xmin, ymin, xmax, ymax] = bbox;
    const [xmin, ymin, xmax, ymax] = image.getBoundingBox();
    const xRes = (xmax - xmin) / width;
    const yRes = (ymax - ymin) / height;
  
    for(let [key, val] of Object.entries(videoTime)){
        const [lat, lng] = val.latLng;

        // get elevation data
        const x = Math.floor((lng - xmin) / xRes);
        const y = Math.floor((ymax - lat) / yRes); // Flip because raster origin is top-left
        const index = y * width + x;
        val.elevation = raster[index];
    }

    


    // const elevations = samplePoints.map(([lng, lat]) => {

    //     const x = Math.floor((lng - xmin) / xRes);
    //     const y = Math.floor((ymax - lat) / yRes); // Flip because raster origin is top-left
    //     const index = y * width + x;
    
    //     return {lat : lat, lon : lng, elevation : raster[index]}; // Elevation in meters
    // });

    
    // // console.log(elevations[t]);
    // smooth_elevations = movingAverage(elevations);
    // return smooth_elevations;

  }


const getSlope = (pointA, pointB) => {

    // Approximate flat distance (use Haversine if needed)
    const R = 6371000; // Earth radius in meters
    const toRad = deg => deg * (Math.PI / 180);


    const dLat = toRad(pointB.lat - pointA.lat);
    const dLon = toRad(pointB.lon - pointA.lon);

    const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(pointA.lat)) * Math.cos(toRad(pointB.lat)) *
                Math.sin(dLon / 2) ** 2;
            
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;  // meters

    const dz = pointB.elevation - pointA.elevation;
    const slopeRadians = Math.atan(dz / distance);
    const slopeDegrees = slopeRadians * (180 / Math.PI);

    
    const slope = slopeDegrees;

    // slope grade
    const slope_percent = (dz / distance) * 100

    // get distance considering elevation
    // square root of h_distance^2 + elevation_difference^2
    const distance_3D = Math.sqrt(distance**2 + dz**2);

    return {
        slope       : slope,
        slope_grade : slope_percent,
        distance    : distance,
        distance_3D : distance_3D
    }
    
    
}