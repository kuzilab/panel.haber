var categoryCtrl = angular.module('categoryCtrl', []);

categoryCtrl.controller('CategoryController', function ($scope, $rootScope, $sce, AuthUser, CrudData, $mdToast, $mdDialog) {

    var vm = this;
    var user = AuthUser.getUser();
    $scope.action_text = "Kaydet";
    $scope.action = "save";

    $scope.categories = {};
    $scope.categories.data = [];

    vm.categoryData = {
        _id: "",
        name: "",
        savedDate: globe.getDate(),
        routePath: "",
        categoryPath: ""
    }

    CrudData.takeCategories(function (response) {
        if (response.data.success === true) {
            var items = response.data.categories;
            console.log(items);
            $scope.categories.data = items;
        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });

    $scope.CancelAction = function (item, evt) {

        $scope.action_text = "Kaydet";
        $scope.action = "save";

        vm.categoryData = {
            _id: "",
            name: "",
            savedDate: globe.getDate(),
            routePath: "",
            categoryPath: ""
        }
    }

    $scope.ChooseCategory = function (item, evt) {
        $scope.action_text = "Güncelle";
        $scope.action = "update";

        console.log(item);

        vm.categoryData = {
            _id: item._id,
            name: item.name,
            savedDate: item.savedDate,
        };
    }

    vm.doCreateCategory = function () {
        if ($scope.action === "save") {

            CrudData.saveCategory(vm.categoryData, function (response) {
                if (response.data.success === true) {
                    if (response.data.situation === "category_created") {
                        CrudData.takeCategories(function (response) {
                            if (response.data.success === true) {
                                var items = response.data.categories;
                                $scope.categories.data = items;
                            } else {
                                var message = response.data.message;
                                globe.showToast($mdToast, message);
                            }
                        });
                        var message = "Kategori Oluşturma Başarılı :)";
                    } else {
                        var message = "Kategori Oluşturma Hata Oluştu !!!";
                    }
                    globe.showToast($mdToast, message);
                } else {
                    var message = response.data.message;
                    globe.showToast($mdToast, message);
                }
            });

        } else if ($scope.action === "update") {

            CrudData.updateCategory(vm.categoryData, function (response) {
                if (response.data.success === true) {

                    if (response.data.situation === "update_success") {
                        CrudData.takeCategories(function (response) {
                            if (response.data.success === true) {
                                var items = response.data.categories;
                                $scope.categories.data = items;
                            } else {
                                var message = response.data.message;
                                globe.showToast($mdToast, message);
                            }
                        });
                        var message = "Kategori Güncelleme Başarılı :)";

                    } else {
                        var message = "Kategori Güncelleme Hata Oluştu !!!";
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

    $scope.DeleteCategory = function (item, evt) {
        var confirm = $mdDialog.confirm()
            .title('')
            .textContent('Kategoriyi silmek istediğinize emin misiniz ?')
            .ariaLabel('delete')
            .targetEvent(evt)
            .ok('Evet')
            .cancel('Hayır');
        $mdDialog.show(confirm).then(function (status) {
            if (status) {

                var obj = {
                    _id: item._id,
                }
                CrudData.deleteCategory(obj, function (response) {

                    if (response.data.success === true) {
                        if (response.data.situation === "delete_success") {

                            CrudData.takeCategories(function (response) {

                                if (response.data.success === true) {
                                    var items = response.data.categories;
                                    console.log("items after delete", items)
                                    $scope.categories.data = items;
                                } else {
                                    var message = response.data.message;
                                    globe.showToast($mdToast, message);
                                }
                            });
                            var message = "Kategori Silme Başarılı :)";

                        } else {
                            var message = "Kategori Silme Hata Oluştu !!!";

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