
const addCSSClasses = (classes, element) => {
  if (typeof classes === 'string') {
    element.classList.add(classes);
  } else if (typeof classes === 'array') {
    element.classList.add(...classes);
  }
}

const removeCSSClasses = (classes, element) => {
  if (typeof classes === 'string') {
    element.classList.remove(classes);
  } else if (typeof classes === 'array') {
    element.classList.remove(...classes);
  }
}

const changeCSSStatus = (alarm, alarmElement) => {
  const allStatii = ['Ok', 'Ignore', 'Alarm'];

  const classesToRemove = allStatii
    .filter(status => status !== alarm.status)
    .map(status => `in${status}State`);
  
  addCSSClasses(`in${alarm.status}State`, alarmElement);
  removeCSSClasses(classesToRemove, alarmElement);
}

const renderAlarmTitle = (alarm, alarmElement) => {
  const renderedTitle = document.createElement('h3');

  renderedTitle.appendChild(document.createTextNode(alarm.title || 'Unamed Alarm'));
  addCSSClasses('alarm__title', renderedTitle);
  
  alarmElement.appendChild(renderedTitle);
}

const renderAlarmDataItem = (key, value, renderedDetails) => {
  if (key != 'title' || key != 'id') {
    const dt = document.createElement('dt');

    addCSSClasses('alarm__field-name', dt);
    dt.appendChild(document.createTextNode(key));
    renderedDetails.appendChild(dt);

    const dd =  document.createElement('dd');

    addCSSClasses('alarm__field-info', dd);
    dd.setAttribute('data_key', key);
    dd.appendChild(document.createTextNode(value));
    renderedDetails.appendChild(dd);
  }
}

const renderAlarmDetails = (alarm, alarmElement) => {
  console.log(alarm);
  const previousRenderedDetails = alarmElement.querySelectorAll('dl');
  previousRenderedDetails.forEach((el)=> {
    el.remove()
  });
  const renderedDetails = document.createElement('dl');

  addCSSClasses('alarm__data', renderedDetails);
  
  Object.entries(alarm).forEach(([key, value]) => {
    renderAlarmDataItem(key, value, renderedDetails)
  });

  alarmElement.appendChild(renderedDetails);
}

const renderAlarm = (alarm, alarmsElement) => {
  const renderedAlarm = document.createElement('li');
  
  renderedAlarm.id = alarm.id;
  renderedAlarm.classList.add('alarm');
  
  renderAlarmTitle(alarm, renderedAlarm);
  renderAlarmDetails(alarm, renderedAlarm);
  changeCSSStatus(alarm, renderedAlarm);
  addCSSClasses('alarm', renderedAlarm);
  alarmsElement.appendChild(renderedAlarm);
}

const hide = (element) => {
  addCSSClasses('hidden', element);
}

const show = (element) => {
  removeCSSClasses('hidden', element);
}

const resetAlarms = (alarmsElement, noAlarmsElement) => {
  alarmsElement.innerHTML = '';
  show(noAlarmsElement);
};

const renderAlarms = ({ alarms }, alarmsElement, noAlarmsElement) => {
  if (alarms && alarms.length) {
    hide(noAlarmsElement);
    alarms.forEach((alarm) => {
      renderAlarm(alarm, alarmsElement);
    });
  } else {
    resetAlarms(alarmsElement, noAlarmsElement);
  }
}

const removeAlarm = (alarm) => {
  document.getElementById(alarm.id).remove();
}

const reRenderAlarm = (alarm) => {

  const alarmElement = document.getElementById(alarm.id);

  changeCSSStatus(alarm, alarmElement);
  renderAlarmDetails(alarm, alarmElement);
} 

export {resetAlarms, renderAlarms, renderAlarm, removeAlarm, reRenderAlarm}