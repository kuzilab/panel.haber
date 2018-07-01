'use strict'
var authService = angular.module('authService', []);
authService.factory('Auth', function ($http, $q, AuthToken, AuthUser) {

    var authFactory = {};

    authFactory.isUser = function (email, callback) {

        return $http.post('/api/isUser', {
            email: email,
        }).then(function (response) {
            callback(response);

        });
    }


    authFactory.signup = function (item, callback) {

        return $http.post('/api/signup', {
            item: item
        }).then(function (response) {

            console.log(response.data);

            if (response.data.success) {
                AuthToken.setToken(response.data.token);
                AuthUser.setUserEmail(response.data.user.email);
                AuthUser.setUser(response.data.user)
                callback(response)
            } else {
                if (response.data.situation === "create_issue") {
                    callback(response);
                }
            }
        });
    }

    authFactory.login = function (email, password, callback) {
        return $http.post('/api/login', {
            email: email,
            password: password
        }).then(function (response) {

            if (response.data.situation === "no_user") {
                callback(response);
            } else {

                if (response.data.situation === "invalid_password") {
                    callback(response);
                } else {

                    console.log(response.data.token);
                    AuthToken.setToken(response.data.token);
                    AuthUser.setUser(response.data.user)
                    callback(response);

                }
            }
        });
    }

    authFactory.logout = function () {
        AuthToken.setToken();
    }

    authFactory.isLoggedIn = function () {

        if (AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    }

    authFactory.getUser = function () {

        if (AuthToken.getToken()) {
            return $http.get('/api/me');
        } else {
            return $q.reject({
                message: "Kullanıcı token'a sahip değil !!!"
            });
        }
    }
    return authFactory;
});


authService.factory('AuthToken', function ($window) {

    var authTokenFactory = {};

    authTokenFactory.getToken = function () {

        return $window.localStorage.getItem('token');
    }

    authTokenFactory.setToken = function (token) {

        console.log("setToken " + token);

        if (token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    }

    return authTokenFactory;

});

authService.factory('AuthUser', function ($window) {

    var authUserFactory = {};

    authUserFactory.setUser = function (user) {

        console.log("set user", user);

        if (user !== null || user !== undefined) {
            $window.localStorage.setItem('user', JSON.stringify(user));
        } else {
            $window.localStorage.removeItem('user');
        }

    }

    authUserFactory.getUser = function () {
        return JSON.parse($window.localStorage.getItem('user'));
    }

    authUserFactory.getUserEmail = function () {
        return $window.localStorage.getItem('email');
    }
    authUserFactory.setUserEmail = function (user) {

        if (user) {
            $window.localStorage.setItem('email', user.email);
        } else {
            $window.localStorage.removeItem('email');
        }
    }
    authUserFactory.clearUserEmail = function () {
        $window.localStorage.removeItem('email');
    }

    return authUserFactory;

})

authService.factory('AuthInterceptor', function ($q, $location, AuthToken) {

    var interceptorFactory = {};

    interceptorFactory.request = function (config) {

        var token = AuthToken.getToken();

        if (token) {

            config.headers['x-access-token'] = token;

        }

        return config;
    };

    interceptorFactory.responseError = function (response) {

        if (response.status == 403) {

            $location.path('/login');
        }

        return $q.reject(response);
    };

    return interceptorFactory;

});