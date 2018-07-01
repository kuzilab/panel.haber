'use strict'
var passService = angular.module('passDataService', []);

passService.service('PassData', function ($rootScope, $window) {


    var savedData = {};
    var passFactory = {};
    var savedExpertise = {};
    var markerLatLng = null;;

    passFactory.setMarkerLatLng = function (lat, lng) {

        markerLatLng = {
            lat: lat,
            lng: lng
        };
    }

    passFactory.getMarkerLatLng = function () {
        return markerLatLng;
    }
    passFactory.setCurrentPosition = function (obj) {

        $window.localStorage.setItem('currentPosition', JSON.stringify(obj));
        $rootScope.currentPosition = obj;
    }

    passFactory.getCurrentPosition = function () {
        return JSON.parse($window.localStorage.getItem('currentPosition'));
    }

    return passFactory;
});