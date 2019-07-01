

import reset from './reset';

export const init = (alarmsElement, noAlarmsElement) =>{
  reset(alarmsElement, noAlarmsElement);
  // var alarms = getCurrentAlarms();
  // if (alarms) {
  //   noAlarmsElement.classList.add('hidden');
  //   alarms.forEach((a) => {
  //     alarmsElement.appendChild(renderAlarm(a));
  //   });
  // }
}

export default init
export { setUpSocketEvents } from './setup-socket-events';