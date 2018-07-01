var extendProfileCtrl = angular.module('extendProfileCtrl', []);

extendProfileCtrl.controller('extendController', function ($scope, $location, MockData, $mdToast, CrudData, AuthUser, Auth) {

    console.log("extendProfile Controller");

    var vm = this
    vm.readonly = false;

    // GET LICENCES FIELDS ---------------------------
    MockData.getLicenceFields().then(function (data) {
        $scope.licences = data;

    });
    // ----------------------------------------------


    // GET EXPERTISE FIELDS ---------------------------  
    MockData.getExpertiseFields().then(function (data) {
        $scope.expertises = data;
    });
    // -----------------------------------------------

    // GET EXPERIENCES FIELDS ---------------------------
    MockData.getExperienceFields().then(function (data) {
        $scope.experiences = data;

    });
    // ----------------------------------------------

    // GET LICENCE YEARS FIELDS ---------------------------  
    MockData.getLicenceYearFields().then(function (data) {
        $scope.licencesyears = data;
    });
    // -----------------------------------------------
    var user = AuthUser.getUser();

    vm.licence = user.licence;
    vm.licenceyear = user.licenceyear;
    vm.highlicence = user.highlicence;
    vm.highlicenceyear = user.highlicenceyear;
    vm.postlicence = user.postlicence;
    vm.postlicenceyear = user.postlicenceyear;
    vm.keywords = user.keywords;
    vm.experience = user.experience;

    console.log("high", vm.highlicence);

    console.log(vm.keywords);

    vm.extendData = {
        id: user._id,
        bureau: user.bureau,
        address: user.address,
        experience: user.experience,
        website: user.website,
        bureauweb: user.bureauweb,
        biography: user.biography,
        licence: user.licence,
        licenceyear: user.licenceyear,
        highlicence: user.highlicence,
        highlicenceyear: user.highlicenceyear,
        postlicence: user.postlicence,
        postlicenceyear: user.postlicenceyear,
        iswebsite: user.iswebsite,
        isbureauweb: user.isbureauweb,
        islicence: user.islicence,
        ishlicence: user.ishlicence,
        isplicence: user.isplicence,
        keywords: user.keywords,
    }

    // Lists of fruit names and Vegetable objects

    vm.keywords = angular.copy(vm.keywords);

    vm.newVeg = function (chip) {
        return {
            name: chip,
            type: 'unknown'
        };
    };

    vm.onModelChange = function (newModel) {
        alert('The model has changed');
    };


    $scope.$watch('extend.extendData.iswebsite', function () {

        if (!vm.extendData.iswebsite) {
            vm.extendData.website = "";
        }
    });

    $scope.$watch('extend.extendData.isbureauweb', function () {

        if (!vm.extendData.isbureauweb) {
            vm.extendData.bureauweb = "";
        }
    });

    $scope.$watch('extend.extenData.iswlicence', function () {

        if (!vm.extendData.wlicence) {
            vm.extendData.licence = "";
            vm.extendData.licenceyear = "";
        }
    });


    $scope.$watch('extend.extendData.ishlicence', function () {

        if (!vm.extendData.hlicence) {
            vm.extendData.highlicence = "";
            vm.extendData.highlicenceyear = "";
        }
    });

    $scope.$watch('extend.extendData.isplicence', function () {

        if (!vm.extendData.plicence) {
            vm.extendData.postlicence = "";
            vm.extendData.postlicenceyear = "";
        }
    });

    vm.getSelectedLicenceYear = function () {
        return vm.licenceyear;
    }
    vm.getSelectedHighLicenceYear = function () {
        return vm.highlicenceyear;
    }
    vm.getSelectedPostLicenceYear = function () {

        return vm.postlicenceyear;
    }
    vm.getLicence = function () {
        return vm.licence;
    }
    vm.getHighLicence = function () {
        return vm.highlicence;
    }

    vm.getPostLicence = function () {
        return vm.postlicence;
    }

    vm.getExperience = function () {
        return vm.experience;
    }

    vm.doUpdateProfile = function () {

        vm.extendData.licence = vm.licence;
        vm.extendData.licenceyear = vm.licenceyear;
        vm.extendData.highlicence = vm.highlicence;
        vm.extendData.highlicenceyear = vm.highlicenceyear;
        vm.extendData.postlicence = vm.postlicence;
        vm.extendData.postlicenceyear = vm.postlicenceyear;
        vm.extendData.keywords = vm.keywords;
        vm.extendData.experience = vm.experience;

        if (vm.extendData.islicence && (vm.extendData.licence === "" || vm.extendData.licenceyear === "")) {
            // do nothing
        } else if (vm.extendData.ishlicence && (vm.extendData.highlicence === "" || vm.extendData.highlicenceyear === "")) {
            // do nothing
        } else if (vm.extendData.isplicence && (vm.extendData.postlicence === "" || vm.extendData.postlicenceyear === "")) {
            // do nothing
        } else {


            CrudData.updateExtendProfile(vm.extendData, function (response) {

                // passwordPlain hash'lemek zorunda kaldım gereksiz sonradan düzelticelecek !!!
                vm.processing = false;
                if (response.data.situation === "update_success") {
                    Auth.login(user.email, user.passwordPlain, function (response) {
                        AuthUser.setUser(response.data.user);
                    });

                    var message = "Güncelleme Başarılı"
                    globe.showToast($mdToast, message)
                }
            });
        }
    }
});