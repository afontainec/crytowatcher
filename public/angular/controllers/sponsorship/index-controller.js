/* eslint-disable */
controllers

  .controller('indexSponsorController', function($scope, Utils) {

    $scope.sponsors = [];
    var today = new Date().getTime();
    $scope.initialize = function (sponsors) {
        $scope.sponsors = JSON.parse(sponsors);
        $scope.sponsors.sort((a,b) => {
          return b.id - a.id;
        });
    }

    $scope.isActive = function(sponsor) {
      startDate = new Date(sponsor.start_date).getTime();
      endDate = new Date(sponsor.end_date).getTime();
      return startDate <= today && today <= endDate;
    }

    $scope.isInactive = function(sponsor) {
      startDate = new Date(sponsor.start_date).getTime();
      return today < startDate;
    }

    $scope.isFinished = function(sponsor) {
      endDate = new Date(sponsor.end_date).getTime();
      return today > endDate;
    }
  });
