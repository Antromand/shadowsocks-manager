const app = angular.module('app');
const window = require('window');
const cdn = window.cdn || '';

app.factory('payByGiftCardDialog', ['$mdDialog', '$http', '$filter',
    ($mdDialog, $http, $filter) => {
        const publicInfo = {
            status: "show",
            password: "",
            accountId: NaN
        };
        const prettyOrderType = $filter('prettyOrderType');

        let dialogPromise = null;
        const isDialogShow = () => dialogPromise && !dialogPromise.$$state.status;

        const show = (accountId) => {
            if (isDialogShow()) {
                return dialogPromise;
            }
            publicInfo.accountId = accountId;
            publicInfo.status = 'show';
            dialogPromise = $mdDialog.show(dialog);
            return dialogPromise;
        };

        const close = () => {
            $mdDialog.hide();
            dialogPromise = null;
        };

        const submit = () => {
            publicInfo.status = "loading";
            $http.post('/api/user/giftcard/use', {
                accountId: publicInfo.accountId,
                password: publicInfo.password
            })
                .then((result) => {
                    publicInfo.status = "finish";
                    const dat = result.data;
                    if (dat.success) {
                        publicInfo.message = `Успешное пополнение${prettyOrderType(dat.type)}Карточка（номер карты ${dat.cardId}）`;
                    } else {
                        publicInfo.message = dat.message;
                    }
                })
                .catch((err) => { publicInfo.status = "finish"; publicInfo.message = "Ошибка перезарядки"; });
        };
        publicInfo.close = close;
        publicInfo.submit = submit;

        const dialog = {
            templateUrl: `${cdn}/public/views/dialog/payByGiftCard.html`,
            escapeToClose: true,
            locals: { bind: publicInfo },
            bindToController: true,
            controller: ['$scope', 'bind', ($scope, bind) => {
                $scope.publicInfo = bind;
            }],
            clickOutsideToClose: false,
        };
        return { show };
    }]);
