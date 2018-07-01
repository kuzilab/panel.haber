'use strict'
var googleMapService = angular.module('googleMapService', []);

googleMapService.factory('GoogleMapster', ['PassData', function (PassData) {

    var mapFactory = {};
    var map = null;
    var currentMarker;
    var markers = [];
    var markerClusterer;
    var directionsDisplay;
    var directionsService;
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();


    //-----------------------------------------------------------------
    // GetMapOptions Function
    mapFactory.getMapOptions = function () {

        var param = {};
        var currentPosition = PassData.getCurrentPosition();
        var mapOptions = {
            center: new google.maps.LatLng(param.lat, param.lng),
            zoom: 7,
            disableDefaultUI: false,
            draggable: true,
            visible: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM,
                style: google.maps.ZoomControlStyle.DEFAULT
            },
            panControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            fullscreenControl: true
        };

        if (currentPosition !== null) {

            param.lat = currentPosition.lat;
            param.lng = currentPosition.lng;

            mapOptions.center = new google.maps.LatLng(param.lat, param.lng);
            return mapOptions;

        } else {

            //  mapFactory._addCurrentPosition = function () {
            // if it is allowed to get current position
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {

                    param.lat = position.coords.latitude;
                    param.lng = position.coords.longitude;

                    var obj = {
                        lat: param.lat,
                        lng: param.lng
                    };
                    PassData.setCurrentPosition(obj);

                    mapOptions.center = new google.maps.LatLng(param.lat, param.lng);
                    return mapOptions;

                });
            }
        }
    }
    // GetMapOptions Function
    // ---------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------
    // _addMarkerByAddress Function
    mapFactory._addMarkerByAddress = function (parameters) {

        console.log("gelen parameters to addMarkerByAddress", parameters);

        var geocoder = new google.maps.Geocoder();

        var position = {
            lat: parameters.lat,
            lng: parameters.lng
        };

        geocoder.geocode({
            location: position
        }, function (results, status) {

            if (status === google.maps.GeocoderStatus.OK) {
                var contentText = parameters.content;

                if (!parameters.current) {
                    contentText = "<div class='map-card'>" +
                        "<img src='../assets/images/avatar.jpg' alt='Avatar' style='width:30%;height:45%'>" +
                        "<div class='map-container'>" +
                        "<h4><b>" + parameters.who + "</b></h4>" +
                        "<p>" + parameters.what + "</p>" +
                        "</div></div>"

                }

                var result = results[0];
                var marker = mapFactory._addMarker({
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng(),
                    content: contentText,
                    icon: parameters.icon,
                    events: parameters.events,
                    event: parameters.event,
                    cluster: parameters.cluster,
                    current: parameters.current
                });

                if (parameters.current) {
                    currentMarker = marker;
                }
            } else {

                // options.error.call(this, status);  --- optional
                console.log(status)
            }
        });
    }
    // _addMarkerByAddress Function
    //--------------------------------------------------------------------------------

    mapFactory.createGoogleMap = function () {

        var self = this;
        var element = document.getElementById('gmaps');

        console.log(element);
        var opts = self.getMapOptions();
        // Create Default Map
        map = new google.maps.Map(element, opts);

        // Using Directions
        directionsDisplay.setMap(map);

        // adding currentMarker ----------------------------------
        var parameters = {
            current: true,
            draggable: false,
            visible: true,
            id: 0,
            event: {
                name: "click",
                callback: function () {
                    console.log("current marker is created")
                }
            }
        };

        var currentPosition = PassData.getCurrentPosition();
        console.log('currentPosition', currentPosition);

        if (currentPosition !== null) {

            parameters.lat = currentPosition.lat;
            parameters.lng = currentPosition.lng;

            mapFactory._addMarkerByAddress(parameters);
            console.log("current added")

        }

        //---------------------------------------------------

        self._getCurrentMarker = function () {
            return currentMarker;
        }

        self._on = function (parameters) {
            google.maps.event.addListener(parameters.obj, parameters.event, function (e) {

                parameters.callback.call(self, e);

            });
        }


        // if you use this method directly - it is without formatted_address
        self._addMarker = function (parameters) {

            var contentText = parameters.content;

            if (!parameters.current) {
                contentText = "<div class='map-card'>" +
                    "<img src='../assets/images/avatar.jpg' alt='Avatar' style='width:20%;height:30%'>" +
                    "<div class='map-container'>" +
                    "<h4><b>" + parameters.who + "</b></h4>" +
                    "<p>" + parameters.what + "</p>" +
                    "</div></div>"
            }

            parameters.position = {
                lat: parameters.lat,
                lng: parameters.lng
            };

            // create marker
            var marker = self._createMarker(parameters);

            console.log("marker is created")

            // add to markerClusterer
            if (markerClusterer) {
                markerClusterer.addMarker(marker);
            }

            // add to markers array
            this._addMarkers(marker);

            if (parameters.cluster) {
                markerClusterer = new MarkerClusterer(map, [], parameters);
            }

            // create content if it has 

            if (parameters.content) {

                var obj = null;
                if (!parameters.current) {

                    obj = {
                        obj: marker,
                        event: 'click',
                        callback: function () {

                            console.log(parameters);

                            PassData.setMarkerLatLng(parameters.lat, parameters.lng);
                            self._calculateRoute(parameters.lat, parameters.lng);
                            // marker click event
                            var infoWindow = new google.maps.InfoWindow({
                                content: parameters.content
                            });

                            infoWindow.open(map, marker)

                            // Event that closes the Info Window with a click on the map
                            google.maps.event.addListener(map, 'click', function (event) {

                                console.log("Latitude :" + event.latLng.lat() + " " + "longtitude :" + event.latLng.lng());
                                infoWindow.close();
                            });
                        }
                    };

                } else {

                    obj = {
                        obj: marker,
                        event: parameters.event.name,
                        callback: parameters.event.callback
                    };
                }
                self._on(obj);
            }

            return marker;
        }

        self._createMarker = function (parameters) {
            parameters.map = map;
            var marker = new google.maps.Marker(parameters);
            marker.set('current', parameters.current);
            return marker
        }

        self._attachEvents = function (obj, events) {
            events.forEach(function (event) {
                self._on({
                    obj: obj,
                    event: event.name,
                    callback: event.callback
                });
            });

        }

        self._calculateRoute = function (markerLat, markerLng) {

            var currentMarker = self._getCurrentMarker();

            if (currentMarker) {

                console.log("calculate route");
                //  var start = "Küçükesat Mahallesi, Bağlayan Sk. No:4, 06660 Çankaya/Ankara, Türkiye";
                var start = new google.maps.LatLng(currentMarker.lat, currentMarker.lng);
                var destination = new google.maps.LatLng(markerLat, markerLng);

                var request = {
                    origin: start,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    }
                });

            } else {
                alert("Yol tarifi için konumunuz belirleniyor 10 saniye sonra tekrar deneyiniz !!!");
            }
        }

        self._removeAllMarkers = function () {

            for (var i = 0; i < markers.length; i++) {

                if (!markers[i].get('current')) {
                    markers[i].setMap(null);
                }
            }
        }
        self._removeMarker = function (marker) {

            var indexOf = markers.indexOf(marker);
            if (indexOf !== -1) {
                markers.splice(indexOf, 1);
                marker.setMap(null);

            }
        }

        self._findMarkerByCityAndDepartment = function (city_id, department_id) {

            console.log('city and department id', city_id, department_id);
            self._removeAllMarkers();
            var doctors = PassData.getDoctors();

            doctors.forEach(function (doctor) {
                if (doctor.cityId === city_id && doctor.department_id === department_id) {
                    console.log(doctor);
                    mapFactory._addMarkerByAddress(doctor)
                }
            });
        }

        self._findMarkerByCity = function (city_id) {
            console.log('city_id', city_id);
            self._removeAllMarkers();
            var doctors = PassData.getDoctors();

            doctors.forEach(function (doctor) {
                if (doctor.cityId === city_id) {
                    console.log(doctor);
                    mapFactory._addMarkerByAddress(doctor)
                }
            });
        }

        self._findMarkerByDepartment = function (department_id) {

            console.log(department_id);

            self._removeAllMarkers();
            var doctors = PassData.getDoctors();


            doctors.forEach(function (doctor) {

                if (doctor.department_id === department_id) {
                    console.log(doctor);
                    mapFactory._addMarkerByAddress(doctor)
                }
            });
        }

        self._findMarkerByLat = function (lat) {

            for (var i = 0; i < markers.length; i++) {

                var marker = markers[i];
                if (marker.position.lat() === lat) {
                    return marker;
                }
            }
        }

        self._addMarkers = function (marker) {
            markers.push(marker);
        }

        self._getMarkers = function () {
            return markers;
        }

        return map;
    }

    return mapFactory;

}]);