var teamCtrl = angular.module('teamCtrl', []);

teamCtrl.controller('TeamController', function ($scope, $rootScope, $sce, AuthUser, CrudData, $mdToast) {

    var vm = this;
    var user = AuthUser.getUser();

    $scope.users = {};
    $scope.users.data = [];

    // GET USERS ----------------------------------------------
    CrudData.takeUsers(function (response) {
        if (response.data.success === true) {
            var items = response.data.users;
            $scope.users.data = items;

        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });

    vm.ChooseUser = function (item, evt) {

    }

    vm.DeleteUser = function (item, evt) {}

    // md-table for videoessays -----------
    $scope.selected = [];
    $scope.limitOptions = [5, 10, 15];

    $scope.options = {
        rowSelection: false,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true
    };

    $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
    };




});