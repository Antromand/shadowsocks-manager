const app = angular.module('app');

app.controller('AdminGiftCardController', ['$scope', '$http', 'addGiftCardBatchDialog', '$state',
  ($scope, $http, addGiftCardBatchDialog, $state) => {
    $scope.setTitle('Управление кодами пополнения');
    $scope.setMenuButton('arrow_back', 'admin.settings');
    const showBatch = () => {
      $http.get('/api/admin/giftcard/list').then(result => {
        $scope.batchList = result.data;
      });
    };
    $scope.showBatch = number => {
      $state.go('admin.giftcardBatchDetails', { batchNumber: number });
    };
    $scope.setFabButton(() => {
      addGiftCardBatchDialog.show().then(() => showBatch());
    });
    showBatch();
    $scope.batchColor = batch => {
      if(batch.status === 'REVOKED') {
        return {
          background: 'red-50', 'border-color': 'red-300',
        };
      }
      return {};
    };
  }
]).controller('AdminGiftCardBatchDetailsController', ['$scope', '$http', '$stateParams', 'confirmDialog', 'alertDialog',
  ($scope, $http, $stateParams, confirmDialog, alertDialog) => {
    const batchNumber = $stateParams.batchNumber;
    $scope.setTitle(`Код пополнения[ ${batchNumber} ]`);
    $scope.setMenuButton('arrow_back', 'admin.listGiftCardBatch');
    const showDetails = () => {
      $http.get(`/api/admin/giftcard/details/${batchNumber}`).then(result => {
        $scope.batch = result.data;
        const content = $scope.batch.cards
          .filter(x => x.status === 'AVAILABLE')
          .map(x => `${x.id},${x.password}\r\n`)
          .reduce((a, b) => a + b, '');
        const blob = new Blob([content], { type: 'text/csv' });
        $scope.exportUrl = (window.URL || window.webkitURL).createObjectURL(blob);
      });
    };
    $scope.showPassword = (id, password) => {
      alertDialog.show(`номер карты：${id}，пароль：${password}`, 'Конечно');
    };
    showDetails();

    $scope.revoke = () => {
      confirmDialog.show({
        text: 'Вы уверены, что хотите отозвать эти карты? Это действие не может быть отменено. ',
        cancel: 'Отмена',
        confirm: 'Отозвать',
        error: 'Неудачный отзыв',
        fn: () => {
          return $http.post(`/api/admin/giftcard/revoke`, { batchNumber });
        },
      }).then(() => {
        showDetails();
      });
    };
  }
]);
