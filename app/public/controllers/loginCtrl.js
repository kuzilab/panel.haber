 var loginCtrl = angular.module('loginCtrl', []);

 loginCtrl.controller('LoginController', function ($scope, $rootScope, $location, Auth, $mdToast, ) {

     var vm = this;
     vm.loggedIn = Auth.isLoggedIn();
     vm.processing = true;
     $rootScope.user = null;

     vm.doLogin = function () {

         vm.processing = false;

         Auth.login(vm.loginData.email, vm.loginData.password, function (response) {

             vm.processing = true;

             if (response.data.success) {
                 $location.path('/dashboard');
             } else {
                 vm.message = response.data.message;
                 vm.situation = response.data.situation;

                 if (vm.situation === "no_user") {
                     globe.showToast($mdToast, vm.message);

                 } else if (vm.situation === "invalid_password") {
                     globe.showToast($mdToast, vm.message);

                 } else if (vm.situation === "valid_user") {
                     // no action 
                 } else {

                     consol.log("other issue")
                 }

             }
         });
     }

     vm.doLogout = function () {
         Auth.logout();
         $location.path('/');
     }

     vm.GoAccount = function () {
         $location.path('/signup');
     }
 });