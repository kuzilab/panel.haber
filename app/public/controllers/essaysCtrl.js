var essaysCtrl = angular.module('essaysCtrl', []);

essaysCtrl.controller('EssaysController', function ($filter, $scope, $rootScope, $location, Auth, $mdDialog, $mdToast, CrudData, AuthUser, UploadSrv) {

    var vm = this;
    var user = AuthUser.getUser();
    $scope.essays = {};
    $scope.essays.data = [];
    $scope.subcategories = {};
    $scope.subcategories.data = [];
    $scope.changedEssayImage = false;
    $scope.picSize = null;

    // GET SUB CATEGORIES ----------------------------------------------
    CrudData.takeSubCategories(function (response) {
        if (response.data.success === true) {
            var items = response.data.subcategories;
            $scope.subcategories.data = items;

        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });

    // INCREASE VIEWED --------------------------------------------------

    CrudData.increaseEssayViewed(function (response) {
        if (response.data.success === true) {
            console.log("Görüntülenme Güncellendi")
        }
    });

    vm.getSubCategory = function () {

        var subCategoryId = vm.essaysData.subCategoryId;
        var result = $filter('filter')($scope.subcategories.data, function (item) {
            if (item._id == subCategoryId) {
                vm.essaysData.categoryName = item.subname
                return item.subname;
            }
        });

        if (result[0] != undefined) {
            vm.essaysData.categoryId = result[0].categoryId;
            return result[0].subname;
        }
    }

    CrudData.takeBasicEssays(user._id, function (response) {

        if (response.data.success === true) {
            var items = response.data.basicessays;
            angular.forEach(items, function (item) {
                var recordedstamp = item.timestamp;
                var currentstamp = new Date().getTime();
                var fark = currentstamp - recordedstamp;
                var date = new Date(fark);
                var minutes = date.getMinutes();
                if (minutes < 10) {
                    item.publishTime = "Şimdi"
                } else {
                    item.publishTime = minutes + " dk önce";
                }
            });
            $scope.essays.data = items.reverse();

        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });

    $scope.action_text = "Kaydet";
    $scope.action = "noaction"
    console.log("essays controller");
    vm.essaysData = {
        userId: undefined,
        essayname: undefined,
        essaysubject: undefined,
        editor: undefined,
        essayImgPath: undefined,
        timestamp: undefined,
        publishTime: undefined,
        categoryId: undefined,
        subCategoryId: undefined,
        savedDate: undefined,
        keywords: [],
        viewed: undefined,
        categoryName: undefined,
        categoryPath: undefined,
        picSize: undefined
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


    vm.previewImg = function () {

        $scope.changedEssayImage = true;
        if ($scope.certificateFile != undefined) {
            $scope.changedEssayImage = true;
            if ($scope.certificateFile.type == "image/jpeg") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var image = new Image();
                    var uri = e.target.result;
                    image.src = uri;
                    image.onload = function () {
                        $scope.width = this.width;
                        $scope.height = this.height;
                        if ($scope.width < 800 || $scope.height < 600) {
                            $scope.picSize = "smaill"
                        } else {
                            $scope.picSize = "large";
                            $scope.changedEssayImage = true;
                        }
                    }
                }
                reader.readAsDataURL($scope.certificateFile);
            } else {
                var message = "Hatalı Dosya Tipi !!!";
                //globe.showToast($mdToast, message);
            }
        }
    }

    vm.UpdateEssay = function () {

        vm.essaysData.essayImgPath = '../assets/essayUploads/' + user._id + "_" + $scope.certificateFileName;
        var filename = user._id + "_" + $scope.certificateFileName;

        if ($scope.picSize != null) {
            vm.essaysData.picSize = $scope.picSize;
        } else {
            vm.essaysData.picSize = "small"
        }

        CrudData.updateBasicEssay(vm.essaysData, function (response) {
            if (response.data.success === true) {
                if (response.data.situation === "update_success") {
                    CrudData.takeBasicEssays(vm.essaysData.userId, function (response) {
                        if (response.data.success === true) {
                            var items = response.data.basicessays;

                            angular.forEach(items, function (item) {

                                var recordedstamp = item.timestamp;
                                var currentstamp = new Date().getTime();
                                var fark = currentstamp - recordedstamp;
                                var date = new Date(fark);
                                var minutes = date.getMinutes();
                                if (minutes < 10) {
                                    item.publishTime = "Şimdi"
                                } else {
                                    item.publishTime = minutes + " dk önce";
                                }
                            });
                            $scope.essays.data = items;
                        } else {
                            var message = response.data.message;
                            globe.showToast($mdToast, message);
                        }
                    });
                    var message = "Haber Güncelleme Başarılı :)";
                    $scope.action = "noaction";
                    $scope.action_text = "Kaydet";
                } else {
                    var message = "Haber Güncelleme Hata Oluştu !!!";

                }
                globe.showToast($mdToast, message);
            } else {

                var message = response.data.message;
                globe.showToast($mdToast, message);
            }
        });

        $scope.action_text = "Kaydet";
    }

    vm.ChooseEssay = function (item) {

        $scope.action = "update";
        $scope.action_text = "Güncelle";
        vm.essaysData = {
            userId: user._id,
            _id: item._id,
            essayname: item.essayname,
            essaysubject: item.essaysubject,
            editor: item.editor,
            essayImgPath: item.essayImgPath,
            timestamp: item.timestamp,
            publishTime: item.publishTime,
            savedDate: item.savedDate,
            keywords: item.keywords,
            categoryId: item.categoryId,
            subCategoryId: item.subCategoryId,
            categoryName: item.categoryName,
            picSize: item.picSize
        };

    }

    vm.DeleteEssay = function (item, evt) {

        vm.essaysData.userId = user._id;

        var confirm = $mdDialog.confirm()
            .title('')
            .textContent('Haberi silmek istediğinize emin misiniz ?')
            .ariaLabel('delete')
            .targetEvent(evt)
            .ok('Evet')
            .cancel('Hayır');
        $mdDialog.show(confirm).then(function (status) {

            if (status) {
                var obj = {
                    _id: item._id,
                    userId: vm.essaysData.userId
                }

                // UploadSrv.deleteFile(vm.essaysData.essayImgPath);
                CrudData.deleteBasicEssay(obj, function (response) {

                    if (response.data.success === true) {
                        if (response.data.situation === "delete_success") {

                            CrudData.takeBasicEssays(vm.essaysData.userId, function (response) {

                                if (response.data.success === true) {
                                    var items = response.data.basicessays;

                                    angular.forEach(items, function (item) {

                                        var recordedstamp = item.timestamp;
                                        var currentstamp = new Date().getTime();
                                        var fark = currentstamp - recordedstamp;
                                        var date = new Date(fark);
                                        var minutes = date.getMinutes();
                                        if (minutes < 10) {
                                            item.publishTime = "Şimdi"
                                        } else {
                                            item.publishTime = minutes + " dk önce";
                                        }
                                    });


                                    console.log("items after delete", items)
                                    $scope.essays.data = items;
                                } else {
                                    var message = response.data.message;
                                    globe.showToast($mdToast, message);
                                }
                            });
                            var message = "Haber Silme Başarılı :)";

                        } else {
                            var message = "Haber Silme Hata Oluştu !!!";

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

    vm.doCreateEssay = function () {

        var action = $scope.action;
        console.log(action);
        vm.essaysData.savedDate = globe.getDate();
        vm.essaysData.userId = user._id;

        if (action === "delete") {

            $mdToast.show(
                $mdToast.simple()
                .textContent("Kaydetme Başarılı :)")
                .position("bottom right")
                .hideDelay(3000)
            );

            vm.essaysData = {
                userId: user._id,
                id: undefined,
                essayname: undefined,
                essaysubject: undefined,
                editor: undefined,
                essayImgPath: undefined,
                timestamp: undefined,
                publishTime: undefined,
                savedDate: undefined,
                categoryId: undefined,
                subCategoryId: undefined,
                viewed: undefined,
                categoryName: undefined,
                categoryPath: undefined,
                picSize: undefined
            }

            $scope.action = "noaction";

        } else if (action == "update") {

            if ($scope.changedEssayImage) {
                vm.essaysData.essayImgPath = '../assets/esssayUploads/' + user._id + "_" + $scope.certificateFileName;
                var filename = user._id + "_" + $scope.certificateFileName;
                UploadSrv.uploadEssay($scope.certificateFile, filename);
                vm.UpdateEssay();
                $scope.action = "noaction";
            } else {
                vm.UpdateEssay();
                $scope.action = "noaction";
            }

        } else if (action == "noaction") {

            if (vm.essaysData.subCategoryId != undefined) {

                if (vm.essaysData.keywords.length != 0) {
                    if ($scope.certificateFile != undefined) {
                        if ($scope.certificateFile.type != undefined) {
                            vm.essaysData.essayImgPath = '../assets/essayUploads/' + user._id + "_" + $scope.certificateFileName;
                            vm.essaysData.timestamp = new Date().getTime();
                            vm.essaysData.viewed = 1;
                            var filename = user._id + "_" + $scope.certificateFileName;
                            if ($scope.picSize != null) {
                                vm.essaysData.picSize = $scope.picSize;
                            } else {
                                vm.essaysData.picSize = "small"
                            }
                            // Update Fields with Profile img
                            UploadSrv.uploadEssay($scope.certificateFile, filename);
                            CrudData.saveBasicEssay(vm.essaysData, function (response) {
                                if (response.data.success === true) {
                                    if (response.data.situation === "basicessay_created") {
                                        CrudData.takeBasicEssays(vm.essaysData.userId, function (response) {
                                            if (response.data.success === true) {
                                                var items = response.data.basicessays;

                                                angular.forEach(items, function (item) {
                                                    var recordedstamp = item.timestamp;
                                                    var currentstamp = new Date().getTime();
                                                    var fark = currentstamp - recordedstamp;
                                                    var date = new Date(fark);
                                                    var minutes = date.getMinutes();
                                                    if (minutes < 10) {
                                                        item.publishTime = "Şimdi"
                                                    } else {
                                                        item.publishTime = minutes + " dk önce";
                                                    }
                                                });


                                                $scope.essays.data = items;

                                            } else {
                                                var message = response.data.message;
                                                globe.showToast($mdToast, message);
                                            }
                                        });
                                        var message = "Haber Yükleme Başarılı :)";
                                    } else {
                                        var message = "Haber Yükleme Hata Oluştu !!!";
                                    }
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
                        var message = "Haber için Ana Resim Seçmelisiniz !!!";
                        globe.showToast($mdToast, message);
                    }

                } else {
                    var message = "Anahtar kelime giriniz !!!";
                    globe.showToast($mdToast, message);
                }

            } else {
                var message = "Alt Kategori Seçiniz !!!";
                globe.showToast($mdToast, message);

            }

            $scope.action = "noaction"
        }
    }
});