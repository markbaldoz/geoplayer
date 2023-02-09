function kml_start(){
    return kml_data = '<?xml version="1.0" encoding="UTF-8"?>'+
                '<kml xmlns="http://www.opengis.net/kml/2.2">'+
                    '<Document>';
}

function initTag(tag, type = 0){
    return '<' + (type !== 0 ? '/' : '') + tag +'>';
}

function tag(tag, value){
    return '<'+ tag +'>'+ value +'</'+ tag +'>';
}

function kml_end(){
    return      '</Document>'+
            '</kml>';
}

function createStyle(id, color, type = 'Polygon'){

    var clean = color.replace('#', "");

    var solid = addAlpha(clean, 1);
    var opacity = addAlpha(clean, 0.7);

    if(['Polygon', 'LineString'].includes(type)){

        var lineWidth = (type === 'Polygon' ? 1 : 3);

        var style =     '<Style id="'+ color.replace('#', "") + '_' + type +'">'+
                            '<LineStyle>'+
                                '<width>'+ lineWidth +'</width>'+
                                '<color>'+ solid +'</color>'+
                            '</LineStyle>';

        if(type === 'Polygon'){

            style +=        '<PolyStyle>'+
                                '<color>'+ opacity +'</color>'+
                            '</PolyStyle>';

        }           
            style +=    '</Style>';

    }

    if(type === 'Point'){

        style = '<Style id="'+ color.replace('#', "") + '_' + type +'">'+
                    '<IconStyle>'+
                        '<color>'+ solid +'</color>'+
                        '<scale>1.1</scale>'+
                        '<Icon>'+
                            '<href>http://maps.google.com/mapfiles/kml/paddle/ltblu-circle.png</href>'+
                        '</Icon>'+
                        '<hotSpot x="32" y="1" xunits="pixels" yunits="pixels"/>'+
                    '</IconStyle>'+
                    '<ListStyle>'+
                        '<ItemIcon>'+
                            '<href>http://maps.google.com/mapfiles/kml/paddle/ltblu-circle-lv.png</href>'+
                        '</ItemIcon>'+
                    '</ListStyle>'+
                '</Style>';
    }

    
    return style;
}


function addAlpha(color, opacity) {
    // coerce values so ti is between 0 and 1.

    var R = color.substring(0,2);
    var G = color.substring(2,4);
    var B = color.substring(4);

    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    var A = _opacity.toString(16).toUpperCase();

    return A.toString() + B.toString() + G.toString() + R.toString() ;
}

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

function download_kml(data, filename){
    var blob = new Blob([data], {
        type : 'octet-stream'
    });

    var href  = URL.createObjectURL(blob);
    var a    = Object.assign(document.createElement("a"),{
        href, 
        style : "display:none",
        download : filename + '.kml'
    });

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(href);
    a.remove();
}


function download_kml_with_progress(data, filename){

    var blob; 
    var request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.send();


        request.onload = function(e){
            blob = new Blob([data], {
                type : 'octet-stream'
            });
        };

        request.onloadend = function(e){
            var href  = URL.createObjectURL(blob);
            var a    = Object.assign(document.createElement("a"),{
                href, 
                style : "display:none",
                download : filename + '.kml'
            });

            document.body.appendChild(a);
            a.click();

            URL.revokeObjectURL(href);
            a.remove();
        }


        request.onprogress = function(e){

        };


    

    
}

/*
|-----------------------------------------------------------------------------
|   MAP ELEMENTS
|-----------------------------------------------------------------------------
*/

function poly_from_points(feature){

    var vertices = new L.FeatureGroup();

    // var poly1 = turf.polygon([[
    //     [-82.574787, 35.594087],
    //     [-82.574787, 35.615581],
    //     [-82.545261, 35.615581],
    //     [-82.545261, 35.594087],
    //     [-82.574787, 35.594087]
    // ]], {"fill": "#0f0"});
    // var poly2 = turf.polygon([[
    //     [-82.560024, 35.585153],
    //     [-82.560024, 35.602602],
    //     [-82.52964, 35.602602],
    //     [-82.52964, 35.585153],
    //     [-82.560024, 35.585153]
    // ]], {"fill": "#00f"});
    
    // var union = turf.union(poly1, poly2);
    // // console.log("union");
    // console.log(union);

    // var coords = [];
    // for(i = 0; i < union.geometry.coordinates[0].length; i++){
    //     var c = union.geometry.coordinates[0][i];
    //     coords.push(c.reverse());
    // }
    // console.log(coords);
    // vertices.addLayer(L.polygon(coords));
    // return vertices;

    var buffered = turf.buffer(feature, 2.5, {units: 'kilometers'});
    console.log(buffered);
    // return;

    var coordinates = feature.geometry.coordinates;
   
    
    

    // vertices.addLayer(L.marker(buffered.geometry.coordinates[0][0]));
    var coords = [];
    for(i = 0; i < buffered.geometry.coordinates[0].length; i++){
        var c = buffered.geometry.coordinates[0][i];
        coords.push(c.reverse());

        // if(i === 0){

        //     var p1 = turf.point(coordinates[0]);
        //     var p2 = turf.point(coordinates[1]);

        //     var bearing = turf.bearing(p1, p2);
        //     var sides = create_side_point(p1, 2.5, bearing, 'left');
        //     vertices.addLayer(L.polyline([sides.left, sides.right]), {color : 'red'});
        //     console.log(sides);

        // }

        // if(i === buffered.geometry.coordinates[0].length - 1){

        //     var p1 = turf.point(coordinates[i]);
        //     var p2 = turf.point(coordinates[i + 1]);

        //     var bearing = turf.bearing(p1, p2);
        //     var sides = create_side_point(p2, 2.5, bearing, 'left');
        //     vertices.addLayer(L.polyline([sides.left, sides.right]), {color : 'red'});
        //     console.log(sides);

        // }
    }


    
    // var sides = create_side_point(p1, 1, bearing, 'left');
    // console.log(sides);

            // vertices.addLayer(L.marker(c.reverse()));
            // vertices.addLayer(L.polyline([sides.left, sides.right]));

    // console.log("coords");
    // console.log(coords);
    vertices.addLayer(L.polygon(coords, {color : '#ffffff', weight: 1}));
    // vertices.addLayer(L.polyline(buffered.geometry.coordinates, {color : 'red'}));
    console.log(vertices);

    

    return vertices;
    

    
    // init_loading('show', 'Processing', true);

    var coordinates = feature.geometry.coordinates;
    var features = turf.featureCollection([]);
    console.log(features);
    var u;
    for(i = 0; i < coordinates.length - 1; i++ ){

        var p1 = turf.point(coordinates[i]);
        var p2 = turf.point(coordinates[i + 1]);

        var bearing = turf.bearing(p1, p2);
        // console.log(bearing);

        var sides = create_side_point(p1, 1, bearing, 'left');
        var sides2 = create_side_point(p2, 1, bearing, 'left');

        var p = L.polygon([sides.left, sides.right, sides2.right, sides2.left]);
        

        var turfP = turf.polygon([[sides.left, sides.right, sides2.right, sides2.left, sides.left]], {combine : 'yes'});
        if(i === 0){
            u = turfP;
        }else{
            u = turf.union(u, turfP);
        }

        features.features.push(turfP);

        // var marker = L.marker([coordinates[i][1],coordinates[i][0]]);
        // vertices.addLayer(p);
    }
    // var dissolved = turf.union(features);
    // dissolved.features.each(function(f){
    //     console.log(f);
    // });
    
    // console.log(dissolved);
    // var layer = dissolved.features[0];
    // console.log(layer.geometry);
    // vertices.addLayer(L.polygon(layer.geometry.coordinates));

    // console.log(features.features.length);
    // var u;
    // for(i = 1; i < features.features.length; i++){
    //     if(i === 1){
    //         u = turf.union(features.features[i - 1], features.features[i]);
    //     }else{
    //         u = turf.union(u, features.features[i]);
    //     }

        
    // }

    console.log(u);
    vertices.addLayer(L.polygon(u.geometry.coordinates));
    // init_loading('hide');
    return vertices;
}

function create_road_influence_area(feature, buffer){

    var areaPoints = [];            // container of upper or left points
    var areaPoints_invert = [];     // container of lower or right points
    var buffer = 2.5;               // RIA wide in km

    // console.log(feature);

    // get line vertices or points
    var coordinates = feature.geometry.coordinates;
    // console.log('points -> ' + coordinates);
    // return;

    var options = {units : 'kilometers'};
    var direction;
    for(i = 1; i < coordinates.length; i++ ){

        // console.log(coordinates[i]);
        var c1 = coordinates[i - 1];
        var c2 = coordinates[i];

        // console.log(c1);

        // var point1 = turf.point([c1.lng, c1.lat]);
        // var point2 = turf.point([c2.lng, c2.lat]);

        // var origin = coordinates[i - 1];
        // var dest   = coordinates[i];

        var point1 = turf.point([c1[0], c1[1]]);
        var point2 = turf.point([c2[0], c2[1]]);

        
        var bearing = turf.bearing(point1, point2);

        if(direction === undefined){
            var q = angle_quadrant(bearing);
            direction = (q < 3 ? 'left' : 'right');
        }

        // console.log(direction);

        // add buffer from starting point
        if(i === 1){
            var startBearing = ((bearing + 180) % 360); // invert angle from point 1 and point 2
            var firstDestination = turf.destination(point1, buffer, startBearing, options);
            var firstLatt = firstDestination.geometry.coordinates[1];
            var firstLng  = firstDestination.geometry.coordinates[0];

            var side_point = create_side_point(turf.point([firstLng, firstLatt]), buffer, startBearing, direction);
            areaPoints.push(side_point.right);
            areaPoints_invert.push(side_point.left);

        }

        var destination = turf.destination(point1, buffer, bearing, options);
        var latt = destination.geometry.coordinates[1];
        var lng  = destination.geometry.coordinates[0];

        var side_point = create_side_point(point1, buffer, bearing, direction);
        areaPoints.push(side_point.left);
        areaPoints_invert.push(side_point.right);



        // console.log(bearing);
        // var destination = turf.destination(point1,distance,bearing);
        // var options = {units: 'kilometers'};

        // var destination = turf.destination(point1, buffer, bearing + (270 - bearing), options);
        // var destination_invert = turf.destination(point1, buffer, (bearing - 270) - bearing, options);
        // // console.log(destination.latlng);

        // // return;

        // var newLatt = destination.geometry.coordinates[1];
        // var newLng = destination.geometry.coordinates[0];

        // var newLatt_invert = destination_invert.geometry.coordinates[1];
        // var newLng_invert = destination_invert.geometry.coordinates[0];



        // // var marker = L.marker([newLatt, newLng]).addTo(map);

        // areaPoints.push([newLatt, newLng]);
        // areaPoints_invert.push([newLatt_invert, newLng_invert]);



        // add buffer from last point
        // if(i === coordinates.length - 1){
        //     var endBearing = bearing; // invert angle from point 1 and point 2
        //     var endDestination = turf.destination(point2, buffer, endBearing, options);
        //     var endLatt = endDestination.geometry.coordinates[1];
        //     var endLng  = endDestination.geometry.coordinates[0];

        //     var side_point = create_side_point(turf.point([endLng, endLatt]), buffer, endBearing);
        //     areaPoints.push(side_point.left);
        //     areaPoints_invert.push(side_point.right);

        // }



    }

    return areaPoints.concat(areaPoints_invert.reverse());
}

function coordinate_to_point(coordinates){
    // console.log(coordinates);
    var c = {};  
    if(typeof coordinates === 'array') c = {lat : origin[1], lng : coordinates[0]};

    if(typeof coordinates === 'object') c = coordinates;

    console.log(typeof coordinates);
    // console.log(c);

    return turf.point([c.lng, c.lat])
}


function create_side_point(point, distance, angle, direction = 'left'){
    // console.log(angle);
    var side_point = {};

    var pos_angle = (angle + 90) % 360;
    var pos_side   = turf.destination(point, distance, pos_angle , {units : 'kilometers'});

    var pos_side_latt = pos_side.geometry.coordinates[1];
    var pos_side_lng  = pos_side.geometry.coordinates[0];
    var pos_latlng = [pos_side_latt, pos_side_lng];


    var neg_angle = (angle - 90) % 360;
    var neg_side   = turf.destination(point, distance, neg_angle , {units : 'kilometers'});

    var neg_side_latt = neg_side.geometry.coordinates[1];
    var neg_side_lng  = neg_side.geometry.coordinates[0];
    var neg_latlng = [neg_side_latt, neg_side_lng];

    var quadrant = angle_quadrant(angle);

    return {
        quadrant : quadrant,
        pos_angle : pos_angle,
        neg_angle  : neg_angle,
        left : direction === 'left' ? pos_latlng : neg_latlng,
        right : direction === 'left' ? neg_latlng : pos_latlng,
    };




}


function angle_quadrant(angle){

    var quadrant = 1;

    if(angle >= -90 && angle <  0)   quadrant = 1;
    if(angle >= 0   && angle <= 90)  quadrant = 2;
    if(angle > 90   && angle <= 180) quadrant = 3;
    if(angle < -90 )                 quadrant = 4;

    return quadrant;
}


function ria_from_station(feature){
    var latLngs = feature.geometry.coordinates;

    var line = turf.lineString(latLngs);
    var totalDistance = getDistance(latLngs);

    var options = {units: 'kilometers'};

    var interval = 0.1; // 500 meters

    var station_count = Math.floor(totalDistance / interval);

    var vertices = new L.FeatureGroup();
    var points = [];
    var lastStation;
    var stationPoints = []
    for(station = 0; station < station_count; station++){
        var along = turf.along(line, station * interval);

        var station_coord = along.geometry.coordinates.slice(0,2);
        // console.log(station_coord);
        // points.push(turf.point(station_coord));
        // [coord[1], coord[0]]
        // var marker = L.marker(station_coord.reverse());


        if(station >= 100000000000000){

            var point1 = turf.point(lastStation);
            var point2 = turf.point(station_coord);

            // console.log(point1);

            var bearing = turf.bearing(point1, point2);

            var corner1 = create_side_point(point1, 1, bearing, 'left');
            var corner2 = create_side_point(point2, 1, bearing, 'left');

            var polyline1 = L.polyline([corner2.left, corner2.right]);
            var polyline2 = L.polyline([corner2.left, corner2.right]);

            // var polygon = L.polygon([corner1.left, corner1.right, corner2.right, corner2.left]);
            // vertices.addLayer(polygon);

        }

    
        lastStation = station_coord;

        stationPoints.push(lastStation.reverse());
        // console.log(lastStation);

        // console.log(marker);
        // vertices.addLayer(marker);

    }

    var createdLine = L.polyline(stationPoints, {color : 'yellow'});
    vertices.addLayer(createdLine);

    return vertices;
    console.log(points[0]);
    for(point = 1; point < points.length; point++){

        var point1 = points[i - 1];
        var point2 = points[i];

        console.log(point1);

        var bearing = turf.bearing(point1, point2);

        var corner1 = create_side_point(point1, 1, bearing, 'left');
        var corner2 = create_side_point(point2, 1, bearing, 'left');

        var polyline1 = L.polyline([corner2.left, corner2.right]);
        var polyline2 = L.polyline([corner2.left, corner2.right]);


        var polygon = L.polygon([corner1.left, corner1.right, corner2.right, corner2.left]);
        vertices.addLayer(polygon);
        // vertices.addLayer(polyline2);



    }

    return vertices;


}

function getDistance(coordinates = []){
    if(coordinates.length === undefined || coordinates.length < 2)  return 0;

    var distance = 0;
    for(i = 1; i < coordinates.length; i++){

        var origin = turf.point(coordinates[i-1]);
        var dest = turf.point(coordinates[i]);
        distance += turf.distance(origin, dest, {units : 'kilometers'});

    }

    return distance;
    
}


