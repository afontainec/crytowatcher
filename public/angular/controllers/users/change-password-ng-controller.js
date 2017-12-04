/* eslint-disable*/
controllers

  .controller('userPasswordController', function($scope, $location, $http, $window, Utils, userService) {
  $scope.i = 0;
  $scope.errorMessage = null;
  $scope.loading = false;
  var idToChange;
  var adminId = null;

  // Get all users
  $scope.initializeUser = function(user, admin_id) {
    if (user) {
      $scope.user = Utils.parseJson(user);
      console.log($scope.user);
    }
    adminId = admin_id;
  };

  function checkPassword(callback) {
    var pass;
    var id = adminId || $scope.user.id;
    console.log(id);
    console.log('aa',adminId);

    $(function() {
      pass = $('input[name=password]').val();

      $scope.loading = true;
      userService.checkAuth(id, pass, function(err, isValid) {
        $scope.loading = false;

        if (err) {
          return callback('Hubo un error, porfavor intentar más tarde.');
        }
        return callback(null, isValid);

      });
    });

  }

  function changePassword(callback) {
    $(function() {
      var old_pass = $('input[name=password]').val();
      var pass = $('input[name=new_password]').val();
      var pass_c = $('input[name=new_password_confirm]').val();
      if (pass != pass_c) {
        return callback('Contraseñas deben ser iguales.');
      }

      $scope.loading = true;
      userService.updatePassword({
        id: $scope.user.id,
        password: old_pass,
        newPassword: pass,
        adminId,
      }, function(err, user) {
        $scope.loading = false;
        if (err) {
          console.log(err);
          return callback('Hubo un error, porfavor intentar más tarde.');
        }
        return callback(null, user);

      });
    });
  }

  var transitionTo1 = function() {
    checkPassword(function(err, success) {
      if (err) {
        $scope.errorMessage = err;
        return;
      }
      if (success) {
        $scope.i = 1;
      } else {
        $scope.errorMessage = 'Contraseña incorrecta';
      }
    });
  }
  var transitionTo2 = function() {
    changePassword(function(err, success) {
      if (err) {
        $scope.errorMessage = err;
        return;
      }
      console.log('trans 2', success);
      if (success) {
        $scope.i = 2;
      } else {
        $scope.errorMessage = 'Hubo un error, porfavor intentar más tarde';
      }
    });
  }

  $scope.debug = function () {
    console.log($scope.form.$error);
  }
  $scope.nextStep = function() {
    $scope.errorMessage = null;
    if ($scope.i == 0) {
      return transitionTo1();
    }
    if ($scope.i == 1) {
      return transitionTo2();
    }
  }
});
