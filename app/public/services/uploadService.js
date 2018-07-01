'use strict'
var uploadService = angular.module('uploadService', []);

uploadService.factory('UploadSrv', function ($http, $q) {

    var uploadFactory = {};

    uploadFactory.deleteFile = function (filename) {

        return $http.post('/api/deleteFile', {
            item: filename
        }).then(function (response) {
            callback(response);
        });
    }

    uploadFactory.uploadProfile = function (file) {

        var formData = new FormData();
        formData.append('profile', file);
        formData.append('profileName', file.name);

        $http.post('/api/uploadProfile', formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    uploadFactory.uploadEssay = function (file, filename) {

        console.log(filename);


        var formData = new FormData();
        formData.append('essay', file);
        formData.append('filename', filename);

        $http.post('/api/uploadEssay', formData, {
            filename: filename,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        });
    }



    uploadFactory.uploadCertificate = function (file, id, filename) {

        console.log("upload", filename);
        console.log("upload id", id);

        var formData = new FormData();
        formData.append('certificate', file);
        formData.append('filename', filename);
        formData.append('id', id);

        $http.post('/api/uploadCertificate', formData, {
            id: id,
            filename: filename,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    return uploadFactory;

});