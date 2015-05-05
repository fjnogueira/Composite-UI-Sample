﻿(function () {

    function CustomerViewModel(customerReadModel) {
        var readModel = customerReadModel;
        this.dataType = 'customer'

        Object.defineProperty(this, 'displayName', {
            get: function () {
                return readModel.displayName;
            }
        });
    };

    angular.module('composite.ui.app.services')
        .config(['$stateProvider', 'backendCompositionServiceProvider', 'navigationServiceProvider',
            function ($stateProvider, backendCompositionServiceProvider, navigationServiceProvider) {

                $stateProvider
                    .state('customers', {
                        url: '/customers',
                        views: {
                            '': {
                                templateUrl: '/app/modules/registry/presentation/customersView.html',
                                controller: 'customersController as customers'
                            }
                        }
                    })
                    .state('customerById', {
                        url: '/customers/{id}',
                        views: {
                            '': {
                                templateUrl: '/app/modules/registry/presentation/customerDetailsView.html',
                                controller: 'customerDetailsController as customerDetails'
                            }
                        }
                    });

                navigationServiceProvider.registerNavigationItem({
                    id: 'customers',
                    displayName: 'Customers',
                    url: '/customers'
                });

                var customerDetailsQueryId = 'customer-details';
                backendCompositionServiceProvider.registerQueryHandlerFactory(customerDetailsQueryId,
                    ['$log', '$http', function ($log, $http) {

                        var handler = {
                            executeQuery: function (args, composedResults) {

                                $log.debug('Ready to handle ', customerDetailsQueryId, ' args: ', args);

                                $http.get('http://localhost:12631/api/customers/' + args.id)
                                    .then(function (response) {
                                        var customer = new CustomerViewModel(response.data);
                                        composedResults.customer = customer;

                                        $log.debug('Query ', customerDetailsQueryId, 'handled: ', composedResults);
                                    });

                            }
                        }

                        return handler;

                    }]);

                var customersListQueryId = 'customers-list';
                backendCompositionServiceProvider.registerQueryHandlerFactory(customersListQueryId,
                    ['$log', '$http', function ($log, $http) {

                        var handler = {
                            executeQuery: function (args, composedResults) {

                                $log.debug('Ready to handle ', customersListQueryId, ' args: ', args);

                                $http.get('http://localhost:12631/api/customers')
                                    .then(function (response) {
                                        var customer = new CustomerViewModel(response.data);
                                        composedResults.customer = customer;

                                        $log.debug('Query ', customersListQueryId, 'handled: ', composedResults);
                                    });

                            }
                        }

                        return handler;

                    }]);

            }]);
}())