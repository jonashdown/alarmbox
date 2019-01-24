function reset() {
  document.getElementById('alarmList').innerHTML = '';
  document.getElementById('noAlarms').classList.remove('hidden');
}


function init() {
  reset();
  var alarms = getCurrentAlarms();
  if (alarms) {
    document.getElementById('noAlarms').classList.add('hidden');
    alarms.forEach((a) => {
      document.getElementById('alarmList').appendChild(renderAlarm(a));
    });
  }
}