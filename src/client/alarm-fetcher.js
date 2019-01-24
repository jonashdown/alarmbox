import { promisfy } from ('util');

const getCurrentAlarms = (url, done) => {
  
  const err = undefined;
  const alarms = [
    {
      id: 'a',
      title: 'Alarm 1',
      some: 'data',
      state: 'Ok'
    },
    {
      id: 'b',
      title: 'Alarm 2',
      some: 'data',
      state: 'Alarm'
    },
    {
      id: 'c',
      title: 'Alarm 3',
      some: 'data',
      state: 'Ignore'
    },
  ];

  done(err, alarms);
}

module.exports = promisify(getCurrentAlarms);
