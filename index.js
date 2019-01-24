const express = require('express');
const {readFile, writeFile, truncate} = require('fs');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const EventEmitter = require('events');
const event = new EventEmitter();
const alarmData = `${__dirname}/data/alarms.json`;

const currentAlarms = [ { id: 'an alarm', title: 'something real bad', state: 'Alarm'}];
// const currentAlarms = readFile(alarmData, (err, data) => {
//   if (err) {
//     return [ { id: 'an alarm', title: 'something real bad', state: 'Alarm'}];
//   }
//   try {
//     return JSON.parse(data);
//   }
//   catch (error) {
//     event.emit('error', error);
//     return [];
//   }
// });

server.listen(3000);
console.log('listening on 3000');

app.use(express.static('public', {index:false, extensions: ['gif', 'png', 'jpg', 'jpeg', 'html', 'css', 'js']}));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.put('/alarm', (req, res) => {
  event.emit('putAlarm', req, res);
});

app.post('/alarm', (req, res) => {
  event.emit('postAlarm', req, res);
});

app.delete('/delete/:alarm', (req, res) => {
  event.emit('deleteAlarm', req,res);
})

app.get('/ignore/:alarm', (req,res) => {});

app.get('/reset', (req,res) => {
  event.emit('reset', req, res);
});

io.on('connection', () => {
  event.emit('connection');
});

event.on('connection', () => {
  setImmediate(() => {
    event.emit('getCurrentAlarms');
  })
})

event.on('connection', () => {
  console.log('connection');
})

event.on('postAlarm', (req,res) => {
  currentAlarms.push(req.params.alarm);
  event.emit('writeAlarmData', currentAlarms);
});

event.on('postAlarm', (req, res) => {
  setTimeout(() => {
    io.emit('postAlarm', req.params.alarm);
  }, 10000);
});

event.on('reset', () => {
  currentAlarms = [];
});

event.on('reset', (req, res) => {
  res.status(200);
  res.send('Alarms Cleared');
})

event.on('reset', () => {
  truncate(alarmData, 0);
});

event.on('reset', () => {
  io.emit('reset');
});

event.on('reset', () => {
  console.log('reset');
});

event.on('getCurrentAlarms', () => {
  io.emit('currentAlarms', currentAlarms);
});

event.on('getCurrentAlarms', () => {
  console.log('currentAlarms', currentAlarms);
});
