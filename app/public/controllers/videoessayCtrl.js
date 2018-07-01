var videoessayCtrl = angular.module('videoessayCtrl', []);

videoessayCtrl.controller('VideoEssayController', function ($filter, $scope, $rootScope, $location, $sce, AuthUser, CrudData, $mdToast, $mdDialog) {

    var vm = this;
    $scope.action_text = "Kaydet";
    $scope.action = "save"
    console.log("video essay controller");
    var user = AuthUser.getUser();
    $scope.videoessays = {
        data: {}
    };
    $scope.subcategories = {};
    $scope.subcategories.data = [];

    vm.videoessayData = {
        userId: user._id,
        videoessayname: "",
        videoessaysubject: "",
        videoessaylink: "",
        videoessaycontent: "",
        keywords: [],
        timestamp: "",
        subCategoryId: "",
        categoryId: "",
        publishTime: "",
        viewed: "",
        savedDate: globe.getDate(),
        categoryName: "",
        routePath: ""
    };

    vm.getSubCategory = function () {

        var subCategoryId = vm.videoessayData.subCategoryId;
        var result = $filter('filter')($scope.subcategories.data, function (item) {
            if (item._id == subCategoryId) {
                vm.videoessayData.categoryName = item.subname
                return item.subname;
            }
        });

        if (result[0] != undefined) {
            vm.videoessayData.categoryId = result[0].categoryId;
            return result[0].subname;
        }
    }

    // INCREASE VIDEO ESSAY VIEWED ------------------------------------
    // INCREASE VIEWED --------------------------------------------------

    CrudData.increaseVideoEssayViewed(function (response) {
        if (response.data.success === true) {
            console.log("Görüntülenme Güncellendi")
        }
    });

    // GET SUB CATEGORIES ----------------------------------------------
    CrudData.takeSubCategories(function (response) {
        if (response.data.success === true) {
            var items = response.data.subcategories;
            $scope.subcategories.data = items;
            console.log(items);

        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });

    CrudData.takeVideoEssays(vm.videoessayData.userId, function (response) {

        console.log(response.data.videoessays)
        if (response.data.success === true) {
            var items = response.data.videoessays;

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
            $scope.videoessays.data = items;

        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });

    vm.doCreateVideoEssay = function () {

        if (vm.videoessayData.subCategoryId != undefined) {

            if (vm.videoessayData.keywords.length != 0) {

                if ($scope.action === "save") {
                    vm.videoessayData.timestamp = new Date().getTime();
                    vm.videoessayData.viewed = 1;
                    CrudData.saveVideoEssay(vm.videoessayData, function (response) {
                        if (response.data.success === true) {
                            if (response.data.situation === "videoessay_created") {
                                CrudData.takeVideoEssays(vm.videoessayData.userId, function (response) {
                                    if (response.data.success === true) {
                                        var items = response.data.videoessays;

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

                                        $scope.videoessays.data = items;

                                    } else {
                                        var message = response.data.message;
                                        globe.showToast($mdToast, message);
                                    }
                                });
                                var message = "Makale Yükleme Başarılı :)";
                            } else {
                                var message = "Makale Yükleme Hata Oluştu !!!";
                            }
                            globe.showToast($mdToast, message);
                        } else {
                            var message = response.data.message;
                            globe.showToast($mdToast, message);
                        }
                    });

                } else if ($scope.action === "update") {

                    CrudData.updateVideoEssay(vm.videoessayData, function (response) {
                        if (response.data.success === true) {

                            if (response.data.situation === "update_success") {
                                CrudData.takeVideoEssays(vm.videoessayData.userId, function (response) {
                                    if (response.data.success === true) {
                                        var items = response.data.videoessays;
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
                                        $scope.videoessays.data = items;
                                    } else {
                                        var message = response.data.message;
                                        globe.showToast($mdToast, message);
                                    }
                                });
                                var message = "Dosya Güncelleme Başarılı :)";
                                $scope.action = "save";
                                $scope.action_text = "Kaydet";
                            } else {
                                var message = "Dosya Güncelleme Hata Oluştur !!!";

                            }
                            globe.showToast($mdToast, message);
                        } else {

                            var message = response.data.message;
                            globe.showToast($mdToast, message);
                        }
                    });
                }
            } else {
                var message = "Anahtar Kelime Giriniz...";
                globe.showToast($mdToast, message);
            }

        } else {
            var message = "Alt Kategori Seçiniz !!!";
            globe.showToast($mdToast, message);
        }
    }

    vm.DeleteVideoEssay = function (item, evt) {

        var confirm = $mdDialog.confirm()
            .title('')
            .textContent('Makaleyi silmek istediğinize emin misiniz ?')
            .ariaLabel('delete')
            .targetEvent(evt)
            .ok('Evet')
            .cancel('Hayır');
        $mdDialog.show(confirm).then(function (status) {
            if (status) {

                var obj = {
                    _id: item._id,
                    userId: vm.videoessayData.userId
                }
                CrudData.deleteVideoEssay(obj, function (response) {

                    if (response.data.success === true) {
                        if (response.data.situation === "delete_success") {

                            CrudData.takeVideoEssays(vm.videoessayData.userId, function (response) {

                                if (response.data.success === true) {
                                    var items = response.data.videoessays;
                                    console.log("items after delete", items)

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
                                    $scope.videoessays.data = items;
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

    vm.ChooseVideoEssay = function (item, evt) {

        $scope.action_text = "Güncelle";
        $scope.action = "update";

        vm.videoessayData = {
            userId: user._id,
            _id: item._id,
            videoessayname: item.videoessayname,
            subCategoryId: item.subCategoryId,
            categoryId: item.categoryId,
            videoessaysubject: item.videoessaysubject,
            videoessaylink: item.videoessaylink,
            videoessaycontent: item.videoessaycontent,
            keywords: item.keywords,
            timestamp: item.timestamp,
            savedDate: item.savedDate,
            categoryName: item.categoryName,
            routePath: item.routePath
        };
    }

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