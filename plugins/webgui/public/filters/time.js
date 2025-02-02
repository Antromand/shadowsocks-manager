const app = angular.module('app');

app.filter('timeago', function() {
  Math.trunc = Math.trunc || function (value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  };
  const timeago = function(input) {
    let ret = '';
    let retTail = '';
    let time = Date.now() - (new Date(input));
    if (time < 0) {
      time = -time;
    } else {
      retTail = 'вперед';
    }
    const day = Math.trunc(time / (24 * 3600 * 1000));
    const hour = Math.trunc(time % (24 * 3600 * 1000) / (3600 * 1000));
    const minute = Math.trunc(time % (24 * 3600 * 1000) % (3600 * 1000) / (60 * 1000));
    if (day) {
      ret += day + 'дни';
    }
    if (day || hour) {
      ret += hour + 'часы';
    }
    if (!day && (hour || minute)) {
      ret += minute + 'минута';
    }
    if (time < (60 * 1000)) {
      ret = 'секунды';
    }
    return ret + retTail;
  };
  timeago.$stateful = true;
  return timeago;
});

app.filter('timeagoshort', function() {
  Math.trunc = Math.trunc || function (value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  };
  return function(input) {

    let ret = '';
    let retTail = '';

    let time = Date.now() - (new Date(input));
    if (time < 0) {
      time = -time;
    } else {
      retTail = 'вперед';
    }

    const day = Math.trunc(time / (24 * 3600 * 1000));
    const hour = Math.trunc(time % (24 * 3600 * 1000) / (3600 * 1000));
    const minute = Math.trunc(time % (24 * 3600 * 1000) % (3600 * 1000) / (60 * 1000));
    if (day) {
      ret += day + 'дни';
    } else if (hour) {
      ret += hour + 'часы';
    } else if (minute) {
      ret += minute + 'минута';
    } else if (time < (60 * 1000)) {
      ret = 'секунды';
    }
    return ret + retTail;
  };
});

app.filter('translateTime', ['$translate', $translate => {
  return input => {
    const currentLanguage = $translate.use();
    if(currentLanguage === 'zh-CN') {
      return input;
    } else if (currentLanguage === 'en-US') {
      const matchDay = input.match(/([0-9]){1,}дни/);
      const matchHour = input.match(/([0-9]){1,}часы/);
      const matchMinute = input.match(/([0-9]){1,}минуты/);
      let ret = '';
      if(matchDay) {
        ret += matchDay[0].substr(0, matchDay[0].length - 1) + (+matchDay[0].substr(0, matchDay[0].length - 1) <= 1 ? ' day ' : ' days ');
      }
      if(matchHour) {
        ret += matchHour[0].substr(0, matchHour[0].length - 2) + (+matchHour[0].substr(0, matchHour[0].length - 2) <= 1 ? ' hour ' : ' hours ');
      }
      if(matchMinute) {
        ret += matchMinute[0].substr(0, matchMinute[0].length - 1) + (+matchMinute[0].substr(0, matchMinute[0].length - 1) <= 1 ? ' min ' : ' mins');
      }
      if(input.match(/секунды/)) {
        ret += 'a few seconds';
      }
      if(input.match(/назад$/)) {
        ret += ' ago';
      }
      return ret;
    }
  };
}]);

app.filter('timePeriod', [() => {
  Math.trunc = Math.trunc || function (value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  };
  const timeago = function(input) {
    let ret = '';
    let time = input;
    const day = Math.trunc(time / (24 * 3600 * 1000));
    const hour = Math.trunc(time % (24 * 3600 * 1000) / (3600 * 1000));
    const minute = Math.trunc(time % (24 * 3600 * 1000) % (3600 * 1000) / (60 * 1000));
    if (day) {
      ret += day + 'дни';
    }
    if (day || hour) {
      ret += hour + 'часы';
    }
    if (!day && (hour || minute)) {
      ret += minute + 'минута';
    }
    if (time < (60 * 1000)) {
      ret = 'секунды';
    }
    return ret;
  };
  return timeago;
}]);

app.filter('timeStr2Num', function() {
  const s = 1000;
  const m = 60 * 1000;
  const h = 60 * 60 * 1000;
  const d = 24 * 60 * 60 * 1000;
  return function(input) {
    if(!input) {
      return 0;
    } else if(Number.isInteger(+input)) {
      return +input;
    }else if(input.match(/^\d{1,}.?\d{0,}s$/)) {
      return +input.substr(0, input.length - 1) * s;
    } else if(input.match(/^\d{1,}.?\d{0,}m$/)) {
      return +input.substr(0, input.length - 1) * m;
    } else if(input.match(/^\d{1,}.?\d{0,}h$/)) {
      return +input.substr(0, input.length - 1) * h;
    } else if(input.match(/^\d{1,}.?\d{0,}d$/)) {
      return +input.substr(0, input.length - 1) * d;
    } else {
      return 1;
    }
  };
});

app.filter('timeNum2Str', function() {
  const s = 1000;
  const m = 60 * 1000;
  const h = 60 * 60 * 1000;
  const d = 24 * 60 * 60 * 1000;
  return function(input) {
    if (input < s) {
      return input;
    } else if (input < m) {
      return +(input / s).toFixed(1) + 's'; 
    } else if (input < h) {
      return +(input / m).toFixed(1) + 'm';
    } else if (input < d) {
      return +(input / h).toFixed(1) + 'h';
    } else {
      return +(input / d).toFixed(1) + 'd';
    }
  };
});
