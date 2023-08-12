import moment from 'moment';

function MomentJsConfig () {
  const config = moment.locale('pt', {
    months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
    monthsShort: 'jan._fev._mar_abr._mai_jun_jul._ago_set._out._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
    weekdaysShort: 'dom._seg._ter._qua._qui._sex._sab.'.split('_'),
    weekdaysMin: 'Do_Se_Te_Qua_Qui_Se_Sa'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD/MM/YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY HH:mm',
      LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
      sameDay: '[Hoje às] LT',
      nextDay: '[Amanhã às] LT',
      nextWeek: 'dddd [para] LT',
      lastDay: '[Ontem às] LT',
      lastWeek: 'dddd [último a] LT',
      sameElse: 'L'
    },
    relativeTime: {
      future: 'dentro %s',
      past: 'há %s',
      s: 'um pouco',
      m: 'um minuto',
      mm: '%d minutos',
      h: 'uma hora',
      hh: '%d horas',
      d: 'um dia',
      dd: '%d dias',
      M: 'um mês',
      MM: '%d meses',
      y: 'um ano',
      yy: '%d anos'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal: function (number) {
      return number + (number === 1 ? 'º' : '');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
      return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem: function (hours,
      // minutes, isLower
    ) {
      return hours < 12 ? 'da manhã' : 'da tarde';
    },
    week: {
      dow: 1, // Monday is the first day of the week.
      doy: 4 // Used to determine first week of the year.
    }
  });

  return config;
}

export default MomentJsConfig;
