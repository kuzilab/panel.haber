var subcategoryCtrl = angular.module('subcategoryCtrl', []);

subcategoryCtrl.controller('SubCategoryController', function ($scope, $rootScope, $sce, AuthUser, CrudData, $mdToast, $filter, $mdDialog) {

    var vm = this;
    var user = AuthUser.getUser();
    $scope.action_text = "Kaydet";
    $scope.action = "save";

    $scope.categories = {};
    $scope.categories.data = [];

    $scope.subcategories = {};
    $scope.subcategories.data = [];

    vm.subcategoryData = {
        _id: "",
        categoryId: "",
        categoryName: "",
        subname: "",
        savedDate: globe.getDate()
    }

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

    // GET CATEGORIES --------------------------------------------------
    CrudData.takeCategories(function (response) {
        if (response.data.success === true) {
            var items = response.data.categories;
            $scope.categories.data = items;
            console.log(items);
        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });


    vm.getCategory = function () {

        var id = vm.subcategoryData.categoryId;
        var result = $filter('filter')($scope.categories.data, function (item) {
            if (item._id == id) {
                return item.name;
            }
        });

        if (result[0] != undefined) {
            vm.subcategoryData.categoryName = result[0].name;
            return result[0].name;
        }
    }

    $scope.CancelAction = function (item, evt) {
        $scope.action_text = "Kaydet";
        $scope.action = "save";

        vm.subcategoryData = {
            _id: "",
            categoryId: "",
            categoryName: "",
            subname: "",
            savedDate: globe.getDate()
        }
    }

    $scope.ChooseSubCategory = function (item, evt) {
        $scope.action_text = "Güncelle";
        $scope.action = "update";

        vm.subcategoryData = {
            _id: item._id,
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            subname: item.subname,
            savedDate: item.savedDate
        };
    }

    $scope.doCreateSubCategory = function () {



        if (vm.subcategoryData.categoryId != "") {
            if ($scope.action === "save") {
                CrudData.saveSubCategory(vm.subcategoryData, function (response) {
                    if (response.data.success === true) {
                        if (response.data.situation === "subcategory_created") {
                            CrudData.takeSubCategories(function (response) {
                                if (response.data.success === true) {
                                    var items = response.data.subcategories;
                                    $scope.subcategories.data = items;
                                } else {
                                    var message = response.data.message;
                                    globe.showToast($mdToast, message);
                                }
                            });
                            var message = "Alt Kategori Oluşturma Başarılı :)";
                        } else {
                            var message = "Alt Kategori Oluşturma Hata Oluştu !!!";
                        }
                        globe.showToast($mdToast, message);
                    } else {
                        var message = response.data.message;
                        globe.showToast($mdToast, message);
                    }
                });

            } else if ($scope.action === "update") {

                CrudData.updateSubCategory(vm.subcategoryData, function (response) {
                    if (response.data.success === true) {

                        if (response.data.situation === "update_success") {
                            CrudData.takeSubCategories(function (response) {
                                if (response.data.success === true) {
                                    var items = response.data.subcategories;
                                    $scope.subcategories.data = items;
                                } else {
                                    var message = response.data.message;
                                    globe.showToast($mdToast, message);
                                }
                            });
                            var message = "Alt Kategori Güncelleme Başarılı :)";

                        } else {
                            var message = "Alt Kategori Güncelleme Hata Oluştu !!!";
                        }
                        globe.showToast($mdToast, message);
                    } else {
                        var message = response.data.message;
                        globe.showToast($mdToast, message);
                    }
                });
            }

            $scope.action = "save";
            $scope.action_text = "Kaydet";

        }


    }

    $scope.DeleteSubCategory = function (item, evt) {
        var confirm = $mdDialog.confirm()
            .title('')
            .textContent('Alt Kategoriyi silmek istediğinize emin misiniz ?')
            .ariaLabel('delete')
            .targetEvent(evt)
            .ok('Evet')
            .cancel('Hayır');
        $mdDialog.show(confirm).then(function (status) {
            if (status) {

                var obj = {
                    _id: item._id,
                }
                CrudData.deleteSubCategory(obj, function (response) {

                    if (response.data.success === true) {
                        if (response.data.situation === "delete_success") {

                            CrudData.takeSubCategories(function (response) {

                                if (response.data.success === true) {
                                    var items = response.data.subcategories;
                                    console.log("items after delete", items)
                                    $scope.subcategories.data = items;
                                } else {
                                    var message = response.data.message;
                                    globe.showToast($mdToast, message);
                                }
                            });
                            var message = "Alt Kategori Silme Başarılı :)";

                        } else {
                            var message = "Alt Kategori Silme Hata Oluştu !!!";

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