const app = angular.module('app');

app.factory('homeApi', ['$http', $http => {
  const userSignup = (email, code, password, ref) => {
    return $http.post('/api/home/signup', {
      email,
      code,
      password,
      ref,
    })
    .then(success => success.data)
    .catch(err => {
      if(err.status === 403) {
        let errData = 'Регистрация пользователя не удалась';
        if(err.data === 'user exists') { errData = 'Пользователь уже существует'; }
        return Promise.reject(errData);
      } else {
        return Promise.reject('Неисправность сети, попробуйте еще раз позже');
      }
    });
  };
  const userLogin = (email, password) => {
    return $http.post('/api/home/login', {
      email,
      password,
    }).then(success => {
      return success.data;
    }).catch(err => {
      if(err.status === 403) {
        let errData = 'Неправильное имя пользователя или пароль';
        if(err.data === 'user not exists') { errData = 'Пользователь еще не зарегистрирован'; }
        if(err.data === 'invalid body') { errData = 'Введите правильный формат имени пользователя.'; }
        if(err.data === 'password retry out of limit') { errData = 'Достигнуто максимальное количество попыток ввода пароля.\nПопробуйте еще раз позже.'; }
        return Promise.reject(errData);
      } else {
        return Promise.reject('Неисправность сети, попробуйте еще раз позже');
      }
    });
  };
  const sendCode = (email, refCode) => {
    return $http.post('/api/home/code', {
      email,
      refCode,
    }).then(success => {
      return 'success';
    }).catch(err => {
      if(err.status === 403) {
        let errData = 'Ошибка отправки проверочного кода';
        if(err.data === 'invalid ref code') { errData = 'Ошибка отправки, неверный код приглашения'; }
        if(err.data === 'email in black list') { errData = 'Ошибка отправки, попробуйте другой адрес электронной почты'; }
        if(err.data === 'send email out of limit') { errData = 'Запрос слишком частый, попробуйте еще раз позже'; }
        if(err.data === 'signup close') { errData = 'Регистрация на текущий период не открыта'; }
        return Promise.reject(errData);
      } else {
        return Promise.reject('Неисправность сети, попробуйте еще раз позже');
      }
    });
  };
  const findPassword = email => {
    if(!email) {
      return Promise.reject('Введите свой адрес электронной почты и нажмите «Восстановить пароль».');
    };
    return $http.post('/api/home/password/sendEmail', {
      email,
    }).then(success => {
      return 'Ссылка для сброса пароля была отправлена ​​на ваш адрес электронной почты, \nпожалуйста, проверьте ее.';
    }).catch(err => {
      let errData = null;
      if(err.status === 403 && err.data === 'already send') {
        errData = 'Ссылка для сброса пароля была отправлена. \nПожалуйста, не отправляйте ее снова.';
      } else if(err.status === 403 && err.data === 'user not exists') {
        errData = 'Пожалуйста, введите действительный адрес электронной почты';
      } else {
        errData = 'Неисправность сети, попробуйте еще раз позже';
      }
      return Promise.reject(errData);
    });
  };

  return {
    userSignup,
    userLogin,
    sendCode,
    findPassword,
  };
}]);
