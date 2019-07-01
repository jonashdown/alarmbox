import {renderAlarms, renderAlarm, reRenderAlarm, resetAlarms} from './alarm-renderer';
import {renderServerTime} from './date-renderer'

const setUpSocketEvents = (socket, alarmsElement, noAlarmsElement, serverTimeElement, clientTimeElement) => {
    socket.on('reset', resetAlarms);

    socket.on('currentAlarms', (alarms) => {
      renderAlarms(alarms, alarmsElement, noAlarmsElement);
    });

    socket.on('pulse', (date) => {
      console.log('pulse');
      renderServerTime(date, serverTimeElement);
    });

    // socket.on('error', function (error) {
    //   console.error(error);
    // });

    socket.on('createAlarm', (alarm) => {
      renderAlarm(alarm, alarmsElement);
    });

    socket.on('modifyAlarm', function (alarm) {
      reRenderAlarm(alarm);
    })

    // socket.on('deleteAlarm', function (a) {
    //   document.getElementById(a.id).remove();
    // });
};

export default setUpSocketEvents;