var signupCtrl = angular.module('signupCtrl', []);

signupCtrl.controller('SignupController', function ($scope, $rootScope, $location, $mdDialog, Auth, GoogleMapster, $mdToast) {

    console.log("signup controller");

    var vm = this
    vm.processing = true;
    vm.signupData = {
            email: undefined,
            namesurname: undefined,
            phone: undefined,
            password: undefined,
            passwordPlain: undefined

        },


        vm.doCreateAccount = function () {

            console.log("validation is success");
            vm.processing = false;
            var email = vm.signupData.email;

            Auth.isUser(email, function (response) {

                vm.processing = true;
                console.log(response.data);

                if (response.data.situation !== "user_exist") {

                    vm.signupData.password = vm.signupData.passwordPlain;
                    Auth.signup(vm.signupData, function (response) {
                        vm.processing = false;
                        console.log(response.data.success);
                        $location.path('/dashboard');
                    });

                } else {

                    var message = response.data.message
                    globe.showToast($mdToast, message);
                }
            });

        };

    vm.doGoLogin = function (evt) {

        var confirm = $mdDialog.confirm()
            .title('')
            .textContent('Kaydı iptal etmek istediğinize emin misiniz ?')
            .ariaLabel('cancel')
            .targetEvent(evt)
            .ok('Evet')
            .cancel('Hayır');

        $mdDialog.show(confirm).then(function (status) {

            if (status) {
                console.log();
                $location.path('/')
            }

        }, function (status) {

        });

    }

    vm.CloseCancel = function () {
        $mdDialog.cancel();
    }

});