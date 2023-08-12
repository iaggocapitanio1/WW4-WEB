import moment from 'moment';

function displayDateDifference (startDateStr, endDateStr) {
  const startDate = moment(startDateStr, 'DD/MM/YYYY HH:mm:ss');
  const endDate = endDateStr ? moment(endDateStr, 'DD/MM/YYYY HH:mm:ss') : moment();
  const diff = moment.duration(endDate.diff(startDate));
  const isNegative = diff.asSeconds() < 0;

  if (isNegative) {
    const positiveDiff = moment.duration(startDate.diff(endDate));

    if (positiveDiff.asSeconds() < 60) {
      return '-' + positiveDiff.asSeconds().toFixed(0) + ' sec';
    } else if (positiveDiff.asSeconds() < 3600) {
      const minutes = Math.floor(positiveDiff.asMinutes());
      const seconds = Math.floor(positiveDiff.asSeconds() - minutes * 60);

      return (
        '-' +
        minutes +
        ':' +
        (seconds < 10 ? '0' : '') +
        seconds +
        ' min'
      );
    } else if (positiveDiff.asSeconds() < 86400) {
      const hours = Math.floor(positiveDiff.asHours());

      const minutes = Math.floor(
        positiveDiff.asMinutes() - hours * 60
      );

      return (
        '-' +
        hours +
        ':' +
        (minutes < 10 ? '0' : '') +
        minutes +
        ':' +
        (positiveDiff.seconds() < 10 ? '0' : '') +
        positiveDiff.seconds() +
        ' horas'
      );
    }

    return '-' + (positiveDiff.asDays().toFixed(0) || 0) + ' dias';
  }

  if (diff.asSeconds() < 60) {
    return diff.asSeconds().toFixed(0) + ' sec';
  } else if (diff.asSeconds() < 3600) {
    const minutes = Math.floor(diff.asMinutes());
    const seconds = Math.floor(diff.asSeconds() - minutes * 60);

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds + ' min';
  } else if (diff.asSeconds() < 86400) {
    const hours = Math.floor(diff.asHours());
    const minutes = Math.floor(diff.asMinutes() - hours * 60);

    return (
      hours +
      ':' +
      (minutes < 10 ? '0' : '') +
      minutes +
      ':' +
      (diff.seconds() < 10 ? '0' : '') +
      diff.seconds() +
      ' horas'
    );
  }

  return (diff.asDays().toFixed(0) || 0) + ' dias';
}

export default displayDateDifference;
