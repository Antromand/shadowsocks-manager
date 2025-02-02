const app = angular.module('app');

app.filter('prettyPrintBatchStatus', function () {
    return function (status) {
        const result = {
            AVAILABLE: 'Доступный',
            USEDUP: 'распроданный',
            REVOKED: 'отзывать'
        };
        return result[status] || 'другой';
    };
});
