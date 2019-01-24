function redAlarm(a) {
  var classlist = document.getElementById(a.id).classList;
  classlist.add('inAlarmState');
  classlist.remove('inIgnoreState');
  classlist.remove('inOkState');
}

function greenAlarm(a) {
  var classlist = document.getElementById(a.id).classList;
  classlist.add('inOkState');
  classlist.remove('inAlarmState');
  classlist.remove('inIgnoreState');
}

function renderAlarmTitle(title) {
  var renderedTitle = document.createElement('h3');
  renderedTitle.appendChild(document.createTextNode(title));
  renderedTitle.classList.add('alarm__name');
  return renderedTitle
}

function renderAlarmDetails (alarm) {
  var renderedDetails = document.createElement('dl');
  renderedDetails.classList.add('alarm__data');
  for (var key in alarm) {
    if (key != 'title' || key != 'id') {
      var dt = document.createElement('dt');
      dt.classList.add('alarm__field-name');
      dt.appendChild(document.createTextNode(key));
      renderedDetails.appendChild(dt);

      var dd =  document.createElement('dd');
      dd.classList.add('alarm__field-info');
      dd.appendChild(document.createTextNode(alarm[key]));
      renderedDetails.appendChild(dd);
    }
  }
  return renderedDetails;
}

function renderAlarm(alarm) {
  var renderedAlarm = document.createElement('li');
  renderedAlarm.id = alarm.id;
  renderedAlarm.appendChild(renderAlarmTitle(alarm.title));
  renderedAlarm.appendChild(renderAlarmDetails(alarm));
  renderedAlarm.classList.add('alarm');
  renderedAlarm.classList.add(`in${alarm.state}State`);
  return renderedAlarm;
}