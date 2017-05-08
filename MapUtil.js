(function(window, google){

//Booleans
var devBool;     //when set to true, additional info will be logged to the console, and edits can 
                                    //be made to certain objects.
                                    //Enable from the console.
var testBool;    //when set to true, certain objects will be displayed that would not be
                                    //visible in a production environment.
                                    //Enable from the console.
var tempPts = [];
//Elevation:
function testingFunctions(){
    function getElevByPoints (locArr, callback){
        var eServ = new google.maps.ElevationService();
        var locObj = {
            locations: locArr
        };
        eServ.getElevationForLocations(locObj, callback);
    }
    function cb_showResultsOnMap(results){
        var cnt = results.length;
        var winStr = '<table>';
        var cell1Str;
        var cell2Str;
        var posElev;
        var posLat;
        var posLng;
        var dataArr = [];
        var i = 0;
        
        for (i = 0; i < cnt; i++){
            posElev = results[i].elevation;
            posLat = tempPts[i].lat();
            posLng = tempPts[i].lng();
            var pntArr = [];
            pntArr.push(posElev, '{lat: ' + posLat + ', lng: ' + posLng + '}');
            dataArr.push(pntArr);
        }
        
        var n = 0;
        var nCnt = dataArr.length;
        
        function stringthis(){
            if (n < nCnt){
                var myPt = dataArr[n];
                cell1Str = '<tr><td>' + myPt[0] + '</td>';
                console.log(myPt[0]);
                cell2Str = '<td>' + myPt[1] + '</td></tr>';
                winStr += cell1Str;
                winStr += cell2Str;
                n++;
            }
        }

        dataArr.forEach(stringthis);
        winStr += '</table>'

        console.log(winStr);

        var myWin = new google.maps.InfoWindow({content: winStr});
        var lastPos = {
            lat: posLat,
            lng: posLng
        };

        myWin.open(gMap, gMap);
        myWin.setPosition(lastPos);

        return results;
    }

    var addNorthMeters = function(myLat, mtrs){
        var newLat;
        var dy = mtrs / 1000;
        var rEarth = 6378;
        var pi = Math.PI;
        newLat = myLat + (dy / rEarth) * (180 / pi);
        return newLat;
    };
    var addSouthMeters = function(myLat, mtrs){
        var newLat;
        var dy = mtrs / 1000;
        var rEarth = 6378;
        var pi = Math.PI;
        newLat = myLat - (dy / rEarth) * (180 / pi);
        return newLat;
    };
    function addEastMeters(myLng, mtrs){
        var newLng;
        var dx = mtrs / 1000;
        var rEarth = 6378;
        var pi = Math.PI;
        var delta = dx / rEarth;
        var degree = myLng * pi/180;
        var cosDeg = Math.cos(degree);
        newLng = myLng + (delta) * (180 / pi) / cosDeg;
        //new_longitude = longitude + (dx / r_earth) * (180 / pi) / cos(latitude * pi/180);
        return newLng;
    }
    var addWestMeters = function(myLng, mtrs){
        var newLng;
        var dx = mtrs / 1000;
        var rEarth = 6378;
        var pi = Math.PI;
        var delta = dx / rEarth;
        var degree = myLng * pi/180;
        var cosDeg = Math.cos(degree);
        newLng = myLng - (delta) * (180 / pi) / cosDeg;
        //new_longitude = longitude - (dx / r_earth) * (180 / pi) / cos(latitude * pi/180);
        return newLng;
    };

    var addPoint = function(myLat, myLng){
        var myPos = {
            lat: myLat,
            lng: myLng
        };
        //options
        var dotOpts = {
            strokeColor: 'Blue',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#f40722',
            fillOpacity: 0.8,
            draggable: true,
            map: gMap,
            center: myPos,
            zIndex: 4,
            radius: 1
        };
        //Add a new circle
        var newDot = new google.maps.Circle(dotOpts);
        return newDot;
    };

    //Get coords and elevation in regular intervals
    var getCoordsElev = function(clickPos){
        var posLat;
        var posLng;
        var posElev;
        var newPt;

        var heatMapWin = new google.maps.InfoWindow({});;
        var pointA;

        var quota = 450;
        var cols = 3;
        var rws = 5;
        var remaining = quota - (cols * rws);
        var remStr = remaining + ' queries remaining';

        var r;
        var n = 0;

        var myNewPos;
        posLat = clickPos.latLng.lat();
        posLng = clickPos.latLng.lng();
        addPoint(posLat, posLng);
        newPt = new google.maps.LatLng(posLat, posLng);
        tempPts.push(newPt);
        for (r = 0; r < rws; r++) {
            if(r == rws){break;}
            var c;
            var rmod;
        for (c = 0; c < cols; c++) {
            if(c == (cols - 1)){break;}
            rmod = ((2 + r) % 2);
            var oldLng;
            var oldLat;
            var newLng;
            var newLat;

            oldLng = tempPts[n].lng();
            oldLat = tempPts[n].lat();
            if (rmod == 0){
                newLng = addEastMeters(oldLng, 7);
            } else {
                newLng = addWestMeters(oldLng, 7);
            }
            newLat = oldLat;

            addPoint(newLat, newLng);
            var myNewPos = new google.maps.LatLng(newLat, newLng);

        tempPts.push(myNewPos);
            n++;
        }
        if (n !== ((rws * cols)-1)){
            var mod = Math.abs((r + 2) % 2);
            console.log(mod);
            var nextOverLng;
            var nextDownLat;
            if (mod == 1) {
                //is even
                nextOverLng = addEastMeters(tempPts[n].lng(), 3.5);
                nextDownLat = addSouthMeters(tempPts[n].lat(), 3.5);
            } else {
                //is odd
                nextOverLng = addWestMeters(tempPts[n].lng(), 3.5);
                nextDownLat = addSouthMeters(tempPts[n].lat(), 3.5);
            }
            var nextPos = new google.maps.LatLng(nextDownLat, nextOverLng);
            addPoint(nextDownLat, nextOverLng);
            tempPts.push(nextPos);
            n++;
        }
        }

        getElevByPoints(tempPts, cb_showResultsOnMap);
        console.log(remStr);
    };

    google.maps.event.addListener(gMap, 'click', function(e){
        getCoordsElev(e);
        //alert('testing is enabled');
    });
}


    //Constructor function:
        var MapUtil = (function(){
            function MapUtil(element, opts){
                this.gMap = new google.maps.Map(element, opts);
            }
            
        //Prototype:
            MapUtil.prototype = {
                enableTest: function(){
                    testBool = true;
                    return testBool;
                },
                disableTest: function(){
                    testBool = false;
                    return testBool;
                },
                getTestBool: function(){
                    if(testBool !== true){
                        testBool = false;
                    } else {
                        testingFunctions();
                    }
                    return testBool;
                }
            };
            
            return MapUtil;
    }());
    
    //Factory function:
        MapUtil.create = function(element, opts){
            var mymap = new MapUtil(element, opts);
            return mymap;
        };
        window.MapUtil = MapUtil;
        
}(window, window.google));