const app = angular.module('app');

app.filter('order', function () {
  return function (status) {
    const result = {
      CREATE: 'создавать',
      WAIT_BUYER_PAY: 'ждать',
      TRADE_SUCCESS: 'Оплата',
      FINISH: 'Заканчивать',
      USED: 'Заканчивать',
      TRADE_CLOSED: 'закрытие',
      created: 'создавать',
      approved: 'Оплата',
      finish: 'Заканчивать',
      closed: 'закрытие',
    };
    return result[status] || 'другой';
  };
})
.filter('prettyOrderId', function () {
  return function (id) {
    return `${id.substr(0, 4)}-${id.substr(4, 2)}-${id.substr(6, 2)} ${id.substr(8, 2)}:${id.substr(10, 2)}:${id.substr(12, 2)} ${id.substr(14)}`;
  };
}).filter('prettyOrderType', function () {
  // TODO: 将此处的类型和其他地方的类型代码全部集中到一处
  return function (type) {
    const cardType = {
      5: 'Час',
      4: 'день',
      2: 'неделя',
      3: 'масяц',
      6: 'Квартал',
      7: 'Год',
      8: 'Две недели',
      9: 'Полгода',
    };
    return cardType[type];
  };
});
