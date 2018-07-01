var videosCtrl = angular.module('videosCtrl', []);

videosCtrl.controller('VideosController', function ($scope, $rootScope, $location, Auth) {

    var vm = this
    console.log("videos controller");

    $scope.$watch('files.length', function (newVal, oldVal) {
        console.log($scope.files);
    });

    vm.onSubmit = function () {

        var formData = new FormData();
        angular.forEach($scope.files, function (obj) {
            if (!obj.isRemote) {
                formData.append('files[]', obj.lfFile);
            }
            console.log(formData)
        });


    }

});