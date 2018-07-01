var app = angular.module('app', ['ngMaterial', 'ngRoute', 'ngAnimate', 'ngAria', 'ngFileUpload', 'md.data.table', 'lfNgMdFileInput', 'passDataService', 'googleMapService', 'crudService', 'froala',
    'ngMessages', 'mockDataService', 'authService', 'uploadService', 'certificateCtrl', 'videoessayCtrl', 'signupCtrl', 'loginCtrl', 'videosCtrl', 'essaysCtrl', 'commentCtrl', 'dashCtrl', 'indexCtrl', 'testCtrl', 'categoryCtrl', 'subcategoryCtrl', 'teamCtrl'
]);


app.run(function ($rootScope, Auth, $mdSidenav, $location) {

    $rootScope.$on('$locationChangeStart', function () {

        console.log("route is changed");
        var path = $location.path();
        $rootScope.loggedIn = Auth.isLoggedIn();

        if (!$rootScope.loggedIn) {

            if (path != "/signup") {
                $location.path("/");
            }
        } else {

            if (path == "/") {
                $location.path("/dashboard")
            }

            $mdSidenav('left').close();
            console.log("loggedIn", $rootScope.loggedIn);
        }
    });
});


app.config(function ($httpProvider, $routeProvider, $locationProvider) {

    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider

        .when('/', {
            templateUrl: '../views/login.html',
            controller: 'LoginController',
            controllerAs: 'login'

        }).when('/signup', {
            templateUrl: '../views/signup.html',
            controller: 'SignupController',
            controllerAs: 'signup'

        }).when('/dashboard', {
            templateUrl: '../views/dashboard.html',
            controller: 'DashController',
            controllerAs: 'dash'

        }).when('/extendProfile', {
            templateUrl: '../views/extendProfile.html',
            controller: 'extendController',
            controllerAs: 'extend'
        }).when('/certificate', {
            templateUrl: '../views/certificate.html',
            controller: 'CertificateController',
            controllerAs: 'certificate'
        }).when('/essays', {
            templateUrl: '../views/essays.html',
            controller: 'EssaysController',
            controllerAs: 'es'
        }).when('/test', {
            templateUrl: '../views/test.html',
            controller: 'TestController',
            controllerAs: 'test'
        }).when('/comment', {
            templateUrl: '../views/comment.html',
            controller: 'CommentController',
            controllerAs: 'comment'
        }).when('/videoessay', {
            templateUrl: '../views/videoessay.html',
            controller: 'VideoEssayController',
            controllerAs: 'videoessay'
        }).when('/test', {
            templateUrl: "../views/test.html",
            controller: 'TestController',
            controllerAs: 'test'
        }).when('/categories', {
            templateUrl: "../views/categories.html",
            controller: 'CategoryController',
            controllerAs: 'category'
        }).when('/subcategories', {
            templateUrl: "../views/subcategories.html",
            controller: 'SubCategoryController',
            controllerAs: 'sub'
        }).when('/team', {
            templateUrl: "../views/team.html",
            controller: 'TeamController',
            controllerAs: 'team'
        });


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});



// Choose File Directive
app.directive('chooseFile', function () {
    return {
        link: function (scope, elem, attrs) {
            var button = elem.find('button');
            var input = angular.element(elem[0].querySelector('input#fileInput'));
            button.bind('click', function () {
                input[0].click();
            });
            input.bind('change', function (e) {
                scope.$apply(function () {
                    var files = e.target.files;
                    if (files[0]) {
                        scope.certificateFileName = files[0].name;
                        scope.certificateFile = files[0];

                    } else {
                        scope.certificateFileName = null;
                        scope.certificateFile = null
                    }
                });
            });
        }
    };
});