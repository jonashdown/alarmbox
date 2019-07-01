const express = require('express');
const bodyParser = require('body-parser');
const { promisify } = require('util');
const fs = require('fs');
const readFileSync = fs.readFileSync;
const writeFile = promisify(fs.writeFile);
const { createAlarm, addAlarm, alarmIsValid, findAlarm, findAlarmIndex, deleteAlarm, modifyAlarm, deleteAll } = require('../shared/alarm-handler');

// const {readFileSync, writeFile, truncate} = require('fs');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const EventEmitter = require('events');
const event = new EventEmitter();
const alarmData = `${__dirname}/../../data/alarms.json`;
const publicroot = `${__dirname}/../client`;
const logger = console; //use a logger her

let currentAlarms;
try {
  currentAlarms = JSON.parse(readFileSync(alarmData));
} catch (error) {
  event.emit('error', error);
}

server.listen(3000);
logger.log('listening on 3000');

setImmediate(() => {
  event.emit('pulse');
}, 5 * 60 * 1000);

app.use(express.static(publicroot, { index: false, extensions: ['gif', 'png', 'jpg', 'jpeg', 'html', 'css', 'js'] }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const options = {
    root: publicroot,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  res.sendFile('index.html', options);
});

app.route('/alarms')
  .get((req, res) => {
    try {
      event.emit('fetchAllAlarms', { req, res });
    } catch (error) {
      const message = 'Error Fetching All Alarms';
      event.emit('error', { message, error, res, defaultStatus: 500 });
    }
  })
  .delete((req, res) => {
    try {
      event.emit('deleteAllAlarms', { req, res });
    } catch (error) {
      const message = 'Error Deleting All Alarms';
      event.emit('error', { message, error, res, defaultStatus: 500 });
    }
  });

app.route('/alarm')
  .put((req, res) => {
    try {
      const alarm = alarmIsValid(req.body.alarm);
      event.emit('modifyAlarm', { alarm, req, res });
    } catch (error) {
      const message = 'Error Modifying Alarm';
      event.emit('error', { message, error });
      res.statusCode = error.status || 404;
      res.send(`${message}, ${error.message}`);
    }
  })
  .post((req, res) => {
    try {
      const alarm = createAlarm(req.body.alarm);
      event.emit('createAlarm', { alarm, req, res });
    } catch (error) {
      const message = 'Error Creating Alarm';
      event.emit('error', { message, error});
      res.statusCode = error.status || 500;
      res.send(`${message}, ${error.message}`);
    }
  });

app.route('/alarm/:id')
  // .all((req, res, next) => {
  //   //get id from request and sainitise
  //   try {
  //     getAlarmIndex(req.params.id);
  //     next();
  //   } catch (error) {
  //     const message = `Alarm ${req.params.id} not found`;
  //     const status = error.status || 404
  //     event.emit('error', {message, error, res, defaultStatus:404});
  //     res.status = status;
  //     res.send(message);
  //     next(error);
  //   }
  // })
  .get((req, res) => {
    try {
      const id = req.params.id; //sanitize
      event.emit('fetchAlarm', { req, res, id });
    } catch (error) {
      const message = `Error fetching alarm with id ${id}`;
      event.emit('error', { message, error });
      res.statusCode = error.status || 404;
      res.send(`${message}, ${error.message}`);
    }
  })
  .delete((req, res) => {
    const id = req.params.id; //sanitize
    event.emit('deleteAlarm', { req, res, id });
  })
  .put((req, res) => {
    try {
      const id = req.params.id; //sanitize
      const alarm = alarmIsValid(req.body.alarm);
      event.emit('modifyAlarm', { alarm, req, res, id });
    } catch (error) {
      const message = 'Error Modifying Alarm';
      event.emit('error', { message, error });
      res.statusCode = error.status || 404;
      res.send(`${message}, ${error.message}`);
    }
  })

app.put('/alarm/:id/:status', (req, res) => { })

io.on('connection', (socket) => {
  event.emit('connection', socket);
});

event.on('connection', (socket) => {
  setImmediate(() => {
    event.emit('getCurrentAlarms', socket);
  })
});

event.on('connection', (socket) => {
  try {
    const { id, handshake } = socket;
    const headers = Object.assign({}, handshake.headers, { referer: '', cookie: '' });
    const connectionDetails = Object.assign({}, handshake, { headers });
    logger.log('connection', { id, connectionDetails });
  } catch (error) {
    const message = `Socket ${id} connection failed`;
    event.emit('error', { message, error, connectionDetails });
  }
});

event.on('fetchAllAlarms', data => {
  try {
    const { req } = data;
    const { ip, originalUrl, path } = req;
    logger.log('fetchAllAlarms', { ip, originalUrl, path });
  } catch (error) {
    const message = 'Error Logging GET request for All Alarms';
    event.emit('error', { message, error });
  }
});

event.on('fetchAllAlarms', data => {
  try {
    const { res } = data;
    res.send(currentAlarms);
  } catch (error) {
    const message = 'Error Sending GET response for All Alarms';
    event.emit('error', { message, error });
  }
});

event.on('deleteAllAlarms', data => {
  try {
    const { req } = data;
    const { ip, originalUrl, path } = req;
    logger.log('deleteAllAlarms', { ip, originalUrl, path });
  } catch (error) {
    const message = 'Error Logging GET request for All Alarms';
    event.emit('error', { message, error });
  }
});

event.on('deleteAllAlarms', () => {
  currentAlarms.alarms = deleteAll();
  event.emit('writeAlarmData');
});

event.on('deleteAllAlarms', data => {
  try {
    const { res } = data;
    res.send(204);
  } catch (error) {
    const message = 'Error responding to DELETE request for All Alarms';
    event.emit('error', { message, error });
  }
});

event.on('deleteAllAlarms', (data) => {
  io.emit('deleteAllAlarms');
});

event.on('createAlarm', data => {
  const { alarm, res } = data;
  currentAlarms.alarms = addAlarm(currentAlarms.alarms, alarm);
  event.emit('writeAlarmData');
  res.status = 201;
  res.send(alarm);
});

event.on('createAlarm', data => {
  const { alarm } = data;
  try {
    io.emit('createAlarm', alarm);
  } catch (error) {
    const message = 'Error Sending New Alarm to Socket';
    event.emit('error', { message, error });
  }
});

event.on('createAlarm', data => {
  try {
    const { alarm, req } = data;
    const { ip, originalUrl, path } = req;
    logger.log('createAlarm', { ip, originalUrl, path, alarm });
  } catch (error) {
    const message = 'Error Logging New Alarm';
    event.emit('error', { message, error });
  }
});

event.on('modifyAlarm', data => {
  const { alarm, res, id } = data;
  currentAlarms.alarms = modifyAlarm(currentAlarms.alarms, alarm ,id);
  const modifiedAlarm = findAlarm(currentAlarms.alarms, id);
  event.emit('writeAlarmData');
  event.emit('updateAlarm', { alarm: modifiedAlarm });
  res.status = 200;
  res.send(modifiedAlarm);
});

event.on('modifyAlarm', data => {
  try {
    const { alarm, req } = data;
    const { ip, originalUrl, path } = req;
    logger.log('modifyAlarm', { ip, originalUrl, path, alarm });
  } catch (error) {
    const message = 'Error Logging Modified Alarm';
    event.emit('error', { message, error });
  }
});

event.on('updateAlarm', data => {
  const { alarm } = data;
  try {
    io.emit('modifyAlarm', alarm);
  } catch (error) {
    const message = 'Error Sending Modified Alarm to Sockets';
    event.emit('error', { message, error });
  }
});

event.on('writeAlarmData', () => {
  writeFile(alarmData, JSON.stringify(currentAlarms))
    .then(() => {
      logger.log('alarm data written to file', alarmData, currentAlarms);
    })
    .catch(error => {
      event.emit('error', error);
    });
});

event.on('fetchAlarm', data => {
  const { req, id } = data;
  try {
    const { ip, originalUrl, path } = req;
    logger.log('fetchAlarm', { ip, originalUrl, path, id });
  } catch (error) {
    const message = `Error Logging Get Request for alarm with id ${id}`;
    event.emit('error', { message, error });
  }
});

event.on('fetchAlarm', data => {
  const { res, id } = data;
  try {
    const alarm = findAlarm(currentAlarms.alarms, id)
    res.status = 200;
    res.send(alarm);
  } catch (error) {
    const message = `Error Sending response for GET alarm id ${id}`;
    event.emit('error', { message, error });
  }
});

event.on('deleteAlarm', data => {
  const { req, id } = data;
  try {
    const { ip, originalUrl, path } = req;
    logger.log('deleteAlarm', { ip, originalUrl, path, id });
  } catch (error) {
    const message = 'Error Logging DELETE Request for alarm';
    event.emit('error', { message, error });
  }
});

event.on('deleteAlarm', data => {
  const { res, id } = data;
  try {
    currentAlarms.alarms = deleteAlarm(currentAlarms.alarms, id)
    event.emit('writeAlarmData');
    res.send(204);
  } catch (error) {
    const message = 'Error handling DELETE Request for alarm';
    event.emit('error', { message, error });
  }
});

event.on('getCurrentAlarms', (socket) => {
  socket.emit('currentAlarms', currentAlarms);
});

event.on('getCurrentAlarms', () => {
  console.log('currentAlarms', currentAlarms);
});

event.on('pulse', (socket) => {
  const date = Date.now();
  try {
    if (socket) {
      socket.emit('pulse', date);
    } else {
      io.emit('pulse', date);
    }
  } catch (error) {
    const message = 'Error broadcasting pulse to sockets';
    event.emit('error', { message, error });
  }
});

event.on('pulse', () => {
  try {
    event.emit('getCurrentAlarms', io);
  } catch (error) {
    const message = 'Error broadcasting pulse to sockets';
    event.emit('error', { message, error });
  }
});

event.on('error', data => {
  const { message, error, defaultStatus } = data;
  if (!error.status) {
    error.status = defaultStatus || 500;
  }
  logger.error({ message, error });
});
