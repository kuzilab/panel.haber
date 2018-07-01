var testCtrl = angular.module('testCtrl', []);

testCtrl.controller('TestController', function ($scope, $rootScope, $location, $sce, AuthUser, CrudData, $mdToast) {

    var vm = this;
    var user = AuthUser.getUser();

    vm.commentData = {
        comments: [{
                userId: user._id,
                commenter: "Ali Başaran",
                commentcontent: "Yardımlarınız için teşekkür ederim.",
                commentrating: "69",
                isComment: false,
                savedDate: ""
            },
            {
                userId: user._id,
                commenter: "Ali Demir",
                commentcontent: "Yardımlarınız için teşekkür ederim.",
                commentrating: "99",
                isComment: false,
                savedDate: ""

            },
            {
                userId: user._id,
                commenter: "Buse Varol",
                commentcontent: "Yardımlarınız için teşekkür ederim.",
                commentrating: "78",
                isComment: false,
                savedDate: ""
            },
        ]
    };

    CrudData.saveManyComment(vm.commentData.comments, function (response) {
        if (response.data.success === true) {
            if (response.data.situation === "comment_created") {

                /*
                CrudData.takeVideoEssays(vm.videoessayData.userId, function (response) {
                    if (response.data.success === true) {
                        var items = response.data.videoessays;
                        $scope.videoessays.data = items;
                    } else {
                        var message = response.data.message;
                        globe.showToast($mdToast, message);
                    }
                });
                */

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








});