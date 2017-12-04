// public/javascripts/angular/controllers
/* eslint-disable */
controllers

  .controller('dashboardController', function($scope, $http, impressionMetrics, surveyService) {
  $scope.places = {
    loading: true,
    count: undefined,
  };
  $scope.surveys = {
    loading: true,
    count: undefined,
  };

  $scope.impressions = {
    loading: true,
    count: undefined,
  };

  $scope.responses = {
    loading: true,
    count: undefined,
  };

  $scope.showModal = function (is_changed) {
    if(!is_changed) {
      $(function(){
        $('#myModal').modal('show');
      })
    }
  }

  function afterCount(err, amount, entry) {
    if(err){
      $scope[entry].count = '-';
      $scope[entry].loading = false;
      return;
    }
    $scope[entry].count = toSimpleString(amount);
    $scope[entry].loading = false;

  }

  $scope.count = function getAmountOf(entry) {
    $scope[entry].loading = true;
    switch (entry) {
      case 'impressions':
        impressionMetrics.countAll(afterCount);
        break;
      case 'surveys':
        surveyService.countAll(afterCount);
        break;
        case 'responses':
          surveyService.countResponses(null, function(err, amount) {
              afterCount(err, amount, 'responses');
          });
          break;
      default:
      $http.get(`/${entry}/count`)
        .success(function success(data) {
          $scope[entry].count = toSimpleString(data.amount);
          $scope[entry].loading = false;
        })
        .error(function error() {
          $scope[entry].count = '-';
          $scope[entry].loading = false;
        });
    }
  };

  function roundDecimal(num) {
    return Math.round(num * 10) / 10;
  }

  function toSimpleString(amount) {
    const one_million = 1000000;
    const one_thousand = 1000;
    const ten_thousand = 10000;
    const fifty_million = 5000000;

    amount = parseInt(amount, 10);
    if (amount >= fifty_million) {
      return '>50M';
    }
    // if (amount >= one_million) {
    //   amount = amount / one_million;
    //   return roundDecimal(amount) + 'M';
    // }
    // if (amount >= ten_thousand) {
    //   amount = amount / one_thousand;
    //   return Math.round(amount) + 'K';
    // }
    // if (amount >= one_thousand) {
    //   amount = amount / one_thousand;
    //   return roundDecimal(amount) + 'K';
    // }
    return amount;
  }
});
