'use strict'
var crudService = angular.module('crudService', []);

crudService.service('CrudData', function ($rootScope, $window, $http) {

    var crudFactory = {};

    // INCREASE ESSAY and VIDEOESSAY VIEWED 

    crudFactory.increaseEssayViewed = function (callback) {
        return $http.post('/api/increaseEssayViewed', {}).then(function (response) {
            callback(response);
        });
    }

    crudFactory.increaseVideoEssayViewed = function (callback) {
        return $http.post('/api/increaseVideoEssayViewed', {}).then(function (response) {
            callback(response);
        });
    }

    // USER SERVICES -----------------------------------------------------

    crudFactory.takeUsers = function (callback) {
        return $http.post('/api/takeUsers', {}).then(function (response) {
            callback(response)
        });
    }

    crudFactory.saveUser = function (item, callback) {
        return $http.post('/api/saveUser', {
            item: item
        }).then(function (response) {
            callback(response)
        });
    }

    crudFactory.updateUser = function (obj, callback) {
        return $http.post('/api/updateUser', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    crudFactory.deleteUser = function (obj, callback) {
        return $http.post('/api/deleteUser', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    // CATEGORY SERVICES -------------------------------------------------

    crudFactory.takeCategories = function (callback) {
        return $http.post('/api/takeCategories', {}).then(function (response) {
            callback(response)
        });
    }


    crudFactory.saveCategory = function (item, callback) {
        return $http.post('/api/saveCategory', {
            item: item
        }).then(function (response) {
            callback(response)
        });
    }

    crudFactory.updateCategory = function (obj, callback) {
        return $http.post('/api/updateCategory', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }


    crudFactory.deleteCategory = function (obj, callback) {
        return $http.post('/api/deleteCategory', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    // SUBCATEGORY SERVICES -------------------------------------------------

    crudFactory.takeSubCategories = function (callback) {
        return $http.post('/api/takeSubCategories', {}).then(function (response) {
            callback(response)
        });
    }


    crudFactory.saveSubCategory = function (item, callback) {
        return $http.post('/api/saveSubCategory', {
            item: item
        }).then(function (response) {
            callback(response)
        });
    }

    crudFactory.updateSubCategory = function (obj, callback) {
        return $http.post('/api/updateSubCategory', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }


    crudFactory.deleteSubCategory = function (obj, callback) {
        return $http.post('/api/deleteSubCategory', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    // ESSAY SERVICES -------------------------------------------------------

    crudFactory.takeBasicEssays = function (userId, callback) {

        return $http.post('/api/takeBasicEssays', {
            userId: userId
        }).then(function (response) {
            callback(response)
        });
    }

    crudFactory.saveBasicEssay = function (item, callback) {

        return $http.post('/api/saveBasicEssay', {
            item: item
        }).then(function (response) {
            callback(response)
        });
    }

    crudFactory.deleteBasicEssay = function (obj, callback) {
        return $http.post('/api/deleteBasicEssay', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    crudFactory.updateBasicEssay = function (obj, callback) {

        return $http.post('/api/updateBasicEssay', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    // VIDEO ESSAY SERVICES-----------------------------------------------

    crudFactory.deleteVideoEssay = function (obj, callback) {
        return $http.post('/api/deleteVideoEssay', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    crudFactory.saveVideoEssay = function (item, callback) {

        return $http.post('/api/saveVideoEssay', {
            item: item
        }).then(function (response) {
            callback(response)
        });
    }

    crudFactory.takeVideoEssays = function (userId, callback) {

        return $http.post('/api/takeVideoEssays', {
            userId: userId
        }).then(function (response) {
            callback(response)
        });
    }


    crudFactory.updateVideoEssay = function (obj, callback) {

        return $http.post('/api/updateVideoEssay', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }


    // EXTEND PROFILE SERVICES ------------------------------------

    crudFactory.updateExtendProfile = function (item, callback) {

        return $http.post('/api/updateExtendProfile', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }


    // COMMENTS SERVICES --------------------------------------------

    crudFactory.takeComments = function (userId, callback) {

        return $http.post('/api/takeComments', {
            userId: userId
        }).then(function (response) {
            callback(response);
        });
    }

    crudFactory.updateComment = function (obj, callback) {

        return $http.post('/api/updateComment', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }


    crudFactory.saveManyComment = function (obj, callback) {

        return $http.post('/api/saveManyComment', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    // PROFILE SERVICES ------------------------------------------------------------

    crudFactory.updateProfile = function (item, callback) {
        return $http.post('/api/updateProfile', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }


    // CERTIFICATE SERVICES --------------------------------------------------

    crudFactory.saveCertificate = function (item, callback) {

        return $http.post('/api/saveCertificate', {
            item: item
        }).then(function (response) {
            callback(response);
        });
    }

    crudFactory.deleteCertificate = function (obj, callback) {
        return $http.post('/api/deleteCertificate', {
            obj: obj
        }).then(function (response) {
            callback(response);
        });
    }

    crudFactory.takeCertificates = function (userId, callback) {

        return $http.post('/api/takeCertificate', {
            userId: userId
        }).then(function (response) {
            callback(response)
        });
    }

    return crudFactory;
});