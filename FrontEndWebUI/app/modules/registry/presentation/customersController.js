﻿(function () {
    angular.module('composite.ui.app.controllers')
        .controller('customersController',
        ['$log', 'backendCompositionService',
            function ($log, backendCompositionService) {

                var vm = this;
                vm.isBusy = null;
                vm.list = null;

                vm.isBusy = backendCompositionService
                    .executeQuery('customers-list', { pageIndex: 0, pageSize: 10 })
                    .then(function (composedResult) {
                        $log.debug('customers-list -> composedResult:', composedResult);
                        vm.list = composedResult.customers;
                    });

            }]);
}())