var certificateCtrl = angular.module('certificateCtrl', []);

certificateCtrl.controller('CertificateController', function ($scope, $rootScope, $location, Auth, $http, $filter, $mdDialog, $mdToast, MockData, AuthUser, UploadSrv, CrudData) {

    // Reset Login Status 
    // will do...

    var vm = this;
    vm.loggedIn = Auth.isLoggedIn();
    $scope.files = {
        data: {}
    };

    var user = AuthUser.getUser();
    vm.certificateData = {
        userId: user._id,
        certificateFile: "",
        certificateFileName: "",
        certificateName: "",
        fileType: "",
        filePath: "",
        savedDate: "",
    }

    // GET CERTIFICATE FIELDS -------------------------------
    MockData.getCertificateFields().then(function (data) {
        $scope.filesType = data;
    });
    // ----------------------------------------------------


    vm.getSelectedFileType = function () {

        if (vm.certificateData.fileType !== undefined) {
            return vm.certificateData.fileType.fileType;
        } else {
            return "Dosya Tipi Seçiniz.";
        }
    }

    CrudData.takeCertificates(vm.certificateData.userId, function (response) {
        if (response.data.success === true) {
            var items = response.data.certificates;
            $scope.files.data = items;

            console.log(items);
        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });

    vm.DeleteFile = function (file, evt) {

        var confirm = $mdDialog.confirm()
            .title('')
            .textContent('Dosyayı silmek istediğinize emin misiniz ?')
            .ariaLabel('delete')
            .targetEvent(evt)
            .ok('Evet')
            .cancel('Hayır');
        $mdDialog.show(confirm).then(function (status) {
            if (status) {

                var userId = vm.certificateData.userId;
                var obj = {
                    _id: file._id,
                    userId: userId
                }
                CrudData.deleteCertificate(obj, function (response) {

                    if (response.data.success === true) {
                        if (response.data.situation === "certificate_deleted") {

                            CrudData.takeCertificates(vm.certificateData.userId, function (response) {

                                if (response.data.success === true) {

                                    var items = response.data.certificates;
                                    $scope.files.data = items;
                                } else {
                                    var message = response.data.message;
                                    globe.showToast($mdToast, message);
                                }
                            });
                            var message = "Dosya Silme Başarılı :)";

                        } else {
                            var message = "Dosya Silme Hata Oluştu !!!";

                        }
                        globe.showToast($mdToast, message);
                    } else {

                        var message = response.data.message;
                        globe.showToast($mdToast, message);
                    }
                });
            }
        }, function (status) {

        });
    }

    vm.doCreateCertificate = function () {

        var extension = globe.getExtension($scope.certificateFileName);
        if (extension === ".pdf" || extension === ".png" || extension === ".jpg") {

            if ($scope.certificateFile === undefined) {
                // do nothing
            } else {

                vm.certificateData.certificateFile = $scope.certificateFile;
                vm.certificateData.certificateFileName = $scope.certificateFileName;
                vm.certificateData.fileType.fileType = vm.certificateData.fileType.fileType;
                vm.certificateData.savedDate = globe.getDate();
                vm.certificateData.filePath = '../assets/uploads/' + vm.certificateData.userId + "_" + vm.certificateData.certificateFileName;

                // Update Fields with Profile img
                UploadSrv.uploadCertificate($scope.certificateFile, vm.certificateData.userId, vm.certificateData.certificateFileName);

                CrudData.saveCertificate(vm.certificateData, function (response) {

                    if (response.data.success === true) {

                        if (response.data.situation === "certificate_created") {

                            CrudData.takeCertificates(vm.certificateData.userId, function (response) {

                                if (response.data.success === true) {
                                    var items = response.data.certificates;
                                    $scope.files.data = items;
                                } else {
                                    var message = response.data.message;
                                    globe.showToast($mdToast, message);
                                }
                            });
                            var message = "Dosya Yükleme Başarılı :)";

                        } else {
                            var message = "Dosya Yükleme Hata Oluştur !!!";

                        }
                        globe.showToast($mdToast, message);
                    } else {

                        var message = response.data.message;
                        globe.showToast($mdToast, message);
                    }
                });
            }
        } else {
            var message = "Dosya uzantısı .PDF,.PNG veya .JPG olmalı !!!"
            globe.showToast($mdToast, message);
        }
    }

    // md-table for certificate -----------
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