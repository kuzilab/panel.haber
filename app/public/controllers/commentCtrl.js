var commentCtrl = angular.module('commentCtrl', []);

commentCtrl.controller('CommentController', function ($scope, $rootScope, $location, $sce, AuthUser, CrudData, $mdToast) {

    console.log("comment Controller");
    var vm = this;

    vm.commentData = {
        comments: {}
    };

    var user = AuthUser.getUser();

    CrudData.takeComments(user._id, function (response) {

        console.log(response.data.comments)
        if (response.data.success === true) {
            var items = response.data.comments;
            vm.commentData.comments = items;
            console.log(items);
        } else {
            var message = response.data.message;
            globe.showToast($mdToast, message);
        }
    });

    vm.changeComment = function (comment) {

        CrudData.updateComment(comment, function (response) {
            if (response.data.success === true) {

                if (response.data.situation === "update_success") {
                    var message = "Durum Değiştirildi :)";

                } else {
                    var message = "Hata Oluştu !!!";
                }
                globe.showToast($mdToast, message);
            } else {

                var message = response.data.message;
                globe.showToast($mdToast, message);
            }
        });


    }

    vm.doUpdateComment = function () {


    }





});