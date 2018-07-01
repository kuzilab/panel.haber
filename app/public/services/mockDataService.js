'use strict'
var mockDataService = angular.module('mockDataService', []);

mockDataService.factory('MockData', function ($http, $q, AuthUser) {

    var mockFactory = {};

    var user = AuthUser.getUser();

    mockFactory.getMenus = function () {

        var deferred = $q.defer();
        $http.get('assets/menus.json').then(function (response) {


            if (user.userType !== "admin") {
                var temp = [];
                for (var i = 0; i < response.data.length; i++) {
                    // if you are author - userType = 2
                    if (response.data[i].userType === "2") {
                        temp.push(response.data[i]);
                    }
                }
                deferred.resolve(temp);

            } else {
                deferred.resolve(response.data);
            }

            console.log(response.data);

            return deferred.promise;
        });

        return deferred.promise;

    }

    mockFactory.getExpertiseFields = function () {

        var deferred = $q.defer();
        $http.get('assets/expertiseFields.json').then(function (response) {
            deferred.resolve(response.data);
            return deferred.promise;
        });
        return deferred.promise;
    }

    mockFactory.getExperienceFields = function () {

        var deferred = $q.defer();
        $http.get('assets/experienceFields.json').then(function (response) {
            deferred.resolve(response.data);
            return deferred.promise;
        });
        return deferred.promise;
    }

    mockFactory.getLicenceYearFields = function () {

        var deferred = $q.defer();
        $http.get('assets/licenceYearFields.json').then(function (response) {
            deferred.resolve(response.data);
            return deferred.promise;
        });
        return deferred.promise;
    }


    mockFactory.getLicenceFields = function () {
        var deferred = $q.defer();
        $http.get('assets/licenceFields.json').then(function (response) {
            deferred.resolve(response.data);
            return deferred.promise;
        });
        return deferred.promise;
    }

    mockFactory.getCertificateFields = function () {
        var deferred = $q.defer();
        $http.get('assets/certificateFields.json').then(function (response) {
            deferred.resolve(response.data);
            return deferred.promise;
        });
        return deferred.promise;
    }

    mockFactory.getRichListPath = function () {

        return $http.get('/api/scrape');
    }

    return mockFactory;

});