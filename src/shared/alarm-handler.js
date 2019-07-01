const nanoid = require('nanoid');

const sanitizeAlarm = (alarm) => { return alarm }; //todo - sanitize
const createAlarm = (alarm) => {
  const sanitizedAlarm = sanitizeAlarm(alarm); //add sanitize step here
  if (!sanitizedAlarm.title) {
    throw {
      name: 'InvalidAlarm',
      message: 'Cannot create an alarm without a title',
      status: 400
    }
  } else {
    const now = new Date();
    return Object.assign(
      {},
      sanitizedAlarm,
      {
        id: sanitizedAlarm.id || nanoid(10),
        created: now,
        modified: now
      }
    );
  }
}

const addAlarm = (alarms, newAlarm) => {
  const alarm = createAlarm(newAlarm); 
  const existingAlarm = alarms.find(a => (a && a.id === alarm.id)) ? true : false;
  if (existingAlarm) {
    throw {
      name: 'DuplicateAlarm',
      message: `Alarm with id ${alarm.id} already exists`,
      status: 409
    }
  } else {
    alarms.unshift(alarm)
    return alarms;
  }
}

const alarmIsValid = (alarm) => {
  const sanitizedAlarm = sanitizeAlarm(alarm);
  if (!sanitizedAlarm.id) {
    throw {
      name: "InvalidAlarm",
      message: "Cannot modify an unknown alarm",
      status: 404
    }
  } else {
    return sanitizedAlarm
  }
};

const findAlarmIndex = (alarms, id) => {
  const indexOfAlarm = alarms.findIndex(alarm => alarm.id === id);
  if (indexOfAlarm === -1) {
    throw {
      name: "AlarmNotFound",
      message: `Alarm with id ${id} not found in list`,
      status: 404
    }
  }
  else return indexOfAlarm;
}

const findAlarm = (alarms, id) => {
  if (!id) {
    throw {
      name: "AlarmNotFound",
      message: `Cannot find alarm without id`,
      status: 404
    }
  }
  const alarm = alarms.find((a) => a.id === id);
  if (!alarm) {
    throw {
      name: "AlarmNotFound",
      message: `Alarm with id ${id} not found in list`,
      status: 404
    }
  }
  else return alarm;
}

const deleteAlarm = (alarms, id) => {
  if (findAlarmIndex(alarms, id) >= 0) {
    return alarms.reduce((acc, a) => {
      if (a.id !== id) {
        acc.push(a);
      }
      return acc;
    }, []);
  }
}

const deleteAll = () => [];

const modifyAlarm = (alarms, alarm) => {
  const index = findAlarmIndex(alarms, alarm.id);
  const alarmToModify = findAlarm(alarms, alarm.id);
  const immutableFields = ['created', 'modified', 'title'];

  immutableFields.forEach(field => {
    if (alarm[field] && alarmToModify[field] !== alarm[field]) {
      throw {
        name: 'UpdateToImmutableField',
        message: `cannot change imutable field '${field}' of alarm with id ${alarm.id}`,
        status: 409
      };
    }
  });

  alarms[index] = Object.assign({}, alarmToModify, alarm, { modified: new Date() });
  return alarms;
}


module.exports = {
  createAlarm,
  addAlarm,
  alarmIsValid,
  findAlarmIndex,
  findAlarm,
  deleteAlarm,
  deleteAll,
  modifyAlarm
};