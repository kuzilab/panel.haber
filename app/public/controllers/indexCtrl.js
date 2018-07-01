var indexCtrl = angular.module('indexCtrl', []);


indexCtrl.controller('IndexController', function ($http, $scope, $rootScope, $location, Auth, $mdSidenav, $mdDialog, AuthUser, Auth, MockData) {

    var vm = this;

    $scope.loading;

    $rootScope.loggedIn = Auth.isLoggedIn();

    console.log("index", $rootScope.loggedIn);

    $scope.baslik = "Panel Haber";
    $scope.bolum = "Bölümler";


    vm.toggleLeft = function () {
        $mdSidenav('left').toggle();
    }

    vm.logout = function (evt) {

        var confirm = $mdDialog.confirm()
            .title('')
            .textContent('Çıkış yapmak istiyor musunuz ?')
            .ariaLabel('logout')
            .targetEvent(evt)
            .ok('Evet')
            .cancel('Hayır');

        $mdDialog.show(confirm).then(function (status) {

            Auth.logout();
            AuthUser.clearUserEmail();
            $rootScope.loggedIn = Auth.isLoggedIn();
            $location.path('/');

        }, function (status) {});
    }

    vm.navigateTo = function (to, event) {

        var link = "/" + to;
        $location.path(link);
        console.log(link);
    };



    if ($rootScope.loggedIn) {
        MockData.getMenus().then(function (data) {
            $scope.menus = data;

            console.log($scope.menus);

        });

    }



});