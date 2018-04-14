$(document).ready(() => {

    // sqrt((x1-x2)^2 + (y1-y2)^2)

    var greatestDistance = 0
    var greatestDistance1;
    var greatestDistance2;


    for (var park in parks) {
        for (var Minipark in parks) {
            var lon1 = parks[park].pos[0]
            var lat1 = parks[park].pos[1]
            var lon2 = parks[Minipark].pos[0]
            var lat2 = parks[Minipark].pos[1]

            var distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
            if (distance > greatestDistance) {
                greatestDistance = distance;
                greatestDistance1 = parks[park];
                greatestDistance2 = parks[Minipark];
            }
        }
    }

    var closestDistance = 9999999999;
    var closestDistance1;
    var closestDistance2;

    for (var park in parks) {
        for (var Minipark in parks) {
            var lon1 = parks[park].pos[0]
            var lat1 = parks[park].pos[1]
            var lon2 = parks[Minipark].pos[0]
            var lat2 = parks[Minipark].pos[1]

            var distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestDistance1 = parks[park];
                closestDistance2 = parks[Minipark];
            }
        }
    }
    $("#facts1").html("The two farthest national parks are " + generateNPMarkup(greatestDistance1) + " and " + generateNPMarkup(greatestDistance2) + ". They're a whopping " + (Math.round(greatestDistance * 10000) / 10000) + "km (" + (Math.round(kmToMiles(greatestDistance) * 10000) / 10000) + "mi) apart.")
    $("#facts2").html("The two closest national parks are " + generateNPMarkup(closestDistance1) + " and " + generateNPMarkup(closestDistance2) + ". They're only " + (Math.round(closestDistance * 10000) / 10000) + "km (" + (Math.round(kmToMiles(closestDistance) * 10000) / 10000) + "mi) apart.")
    $("#facts-header").fadeIn();
    $("#facts1").fadeIn();
    $("#facts2").fadeIn();

});

$("#explore-button").click(() => {
    $("#floatingRectangle").css("width", "30vw");
    $("#floatingRectangle").css("height", "100vh");
    $("#floatingRectangle").css("top", "0px");
    $("#floatingRectangle").css("left", "0px");
    $("#map").css("right", "0")
    $("#map").css("width", "70vw")
    $("#floatingRectangleGettingStarted").fadeOut(()=>{
        for (var park in parks) {
            $("#parks").append($("<li></li>").append(generateNPMarkup(parks[park])));
        }
        $("#parksList").fadeIn();
    });
});

function zoomTo(park) {
    map.flyTo({
        center: [
            park.pos[0],
            park.pos[1]
        ]
    });
}

function zoomTo(lat, long) {
    map.flyTo({
        center: [
            lat,
            long
        ],
        zoom: 15
    });
}


//formula from http://www.movable-type.co.uk/scripts/latlong.html
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function kmToMiles(km) { return km / 1.609344; }

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function generateNPMarkup(park) {
    return "<a href=\"#\" onclick=\"zoomTo(" + park.pos[0] + ", " + park.pos[1] + ")\">" + park.Name + "</a> (<a href=\"#\" onclick=\"showParkModal(\'" + park.Name + "\',[" + park.pos[0] + "," + park.pos[1] + "])\">info</a>)";
}


function showParkModal(name, pos) {
    $("#longitude").text(pos[1])
    $("#latitude").text(pos[0])
    $(".modal-loading").fadeIn(0);
    $(".modal-info").fadeOut(0);
    $("#parkModalLabel").text(name);
    $('#parkModal').modal()
    $.get("https://en.wikipedia.org/w/api.php?action=query&titles=" + name +"&prop=revisions&rvprop=content&format=json&formatversion=2&origin=*", (data) => {
        $("#wikipedia-content").html(InstaView.convert(data.query.pages[0].revisions[0].content));
        $("#loading-wikipedia").fadeOut(()=>{
            $("#wikipedia-content").fadeIn();
        })
    });
    // $.get("https://api.darksky.net/forecast/[key]/[latitude],[longitude]" + park.Name +"&prop=revisions&rvprop=content&format=json&formatversion=2&origin=" + document.domain, (data) => {
    //     $("#wikipedia-content").text(data);
    //     console.log(data);
    //     $("#wikipedia-content").fadeIn();
    // });

    //      https://api.darksky.net/forecast/[key]/[latitude],[longitude]
}