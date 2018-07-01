var dashCtrl = angular.module('dashCtrl', []);

dashCtrl.controller('DashController', function ($http, $scope, $rootScope, $location, Auth, $mdSidenav, $mdDialog, AuthUser, Auth, AuthUser, MockData, CrudData, UploadSrv, $mdToast, GoogleMapster) {

    console.log("Dash Controller")

    var vm = this;
    $scope.changedProfile = false;

    // GET USER ---------------------------------------
    var user = AuthUser.getUser();

    // SET PROFILE OBJECT ----------------------------
    $scope.namesurname = user.name;

    vm.dashData = {
        id: user._id,
        namesurname: user.name,
        email: user.email,
        password: null,
        passwordPlain: user.passwordPlain,
        phone: user.phone,
        profile: '../assets/uploads/' + user._id + ".png"
    }

    vm.CloseCancel = function () {
        $mdDialog.cancel();
    }

    vm.doUpdateProfile = function () {

        if (vm.dashData.phone !== undefined) {
            if ($scope.changedProfile) {
                if ($scope.certificateFile.type != undefined) {

                    // Update Fields with Profile img
                    UploadSrv.uploadProfile($scope.certificateFile);
                    vm.dashData.profile = '../assets/uploads/' + user._id + ".png";
                    vm.dashData.password = vm.dashData.passwordPlain;
                    CrudData.updateProfile(vm.dashData, function (response) {

                        if (response.data.success === true) {
                            Auth.login(vm.dashData.email, vm.dashData.password, function (response) {
                                AuthUser.setUser(response.data.user);
                            });

                            var message = "Güncelleme Başarılı :)";
                            globe.showToast($mdToast, message);
                        } else {
                            var message = response.data.message;
                            globe.showToast($mdToast, message);
                        }
                    });
                } else {

                    var message = "Dosya Tipi Geçerli Değil !!!";
                    globe.showToast($mdToast, message);
                }

            } else {

                // Update Fields without profile img
                vm.dashData.password = vm.dashData.passwordPlain;
                CrudData.updateProfile(vm.dashData, function (response) {
                    console.log(response.data);

                    if (response.data.success === true) {
                        Auth.login(vm.dashData.email, vm.dashData.password, function (response) {});
                        var message = "Güncelleme Başarılı :)";
                        globe.showToast($mdToast, message);
                    } else {
                        var message = response.data.message;
                        globe.showToast($mdToast, message);
                    }

                });
            }
        }
    }

    vm.previewImg = function () {

        if ($scope.certificateFile != undefined) {
            if ($scope.certificateFile.type == "image/jpeg") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var image = new Image();
                    var uri = e.target.result;
                    image.src = uri;
                    image.onload = function () {
                        $scope.width = this.width;
                        $scope.height = this.height;
                        if ($scope.width > 1000 || $scope.height > 1000) {
                            alert("Profil resminin yüksekliği ve genişliği 300px'den büyük olamaz !!!");
                        } else {
                            vm.dashData.profile = e.target.result;
                            $scope.changedProfile = true;

                        }
                    }
                }
                reader.readAsDataURL($scope.certificateFile);
            } else {
                var message = "Hatalı Dosya Tipi !!!";
                globe.showToast($mdToast, message);
            }
        }
    }

});