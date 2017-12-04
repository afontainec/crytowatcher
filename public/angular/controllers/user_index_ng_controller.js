/* eslint-disable*/
controllers

    .controller('userIndexController', function ($scope, $http, $window, Utils) {
        $scope.users = {};
        $scope.myOrderBy = 'name';

    // Get all users
        $scope.initializeUsers = function (users) {
            if (users) {
                $scope.users = Utils.parseJson(users);
            }
        };


        $scope.getKeys = function (json) {
            return Object.keys(json);
        };

        $scope.setOrderBy = function (key) {
            if ($scope.myOrderBy === key) {
                $scope.myOrderBy = `-${key}`;
            }
            else {
                $scope.myOrderBy = key;
            }
        };


        $scope.toggleIsActive = function (user) {
            $http.put(`/users/${user.id}/toggleIsActive`)
            .success(function (data) {
                locallyUpdateUser(data.user);
            })
            .error(function (data) {});
        };


        function locallyUpdateUser(updated_user) {
            for (let i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].id === updated_user.id) {
                $scope.users[i] = updated_user;
                }
            }
        }


    // updates a user
        $scope.updateUser = function (user) {
            if ($scope.validForm()) {
                $http.put('/users/' + $scope.selectedUser.id + '/edit', $scope.selectedUser)
                .success(function (data) {
                    user = data.user;
                    console.log(user);
                    $window.location.href = '/users/' + user.id;
                })
                .error(function (error) {
                    console.log(error);
                });
            }
        };


        $scope.getTotalVisits = function (user) {
            $http.get('/api/v1/users/' + user.id + '/metrics/visits/count')

        .success(function (results) {
            user.totalVisits = results.data;
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const firstDate = new Date(results.date);
            const secondDate = new Date();


            const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
            user.totalDays = diffDays;
        })
            .error(function (data) {});
        };

        $scope.getTotalEndUsers = function (user) {
            $http.get('/api/v1/users/' + user.id + '/metrics/endusers/count')

        .success(function (results) {
            user.totalEndUsers = results.data.toString();
        })
            .error(function (data) {});
        };
    });
