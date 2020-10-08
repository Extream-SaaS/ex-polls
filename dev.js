require('dotenv').config();
const { manage } = require('./index');
let payload, data, event;
// associate itinerary item
// payload = {
//   domain: 'admin',
//   action: 'item',
//   command: 'create',
//   payload: {
//     type: 'poll',
//     id: 'VrtZIutGiSghmnmeqXyl'
//   }
// };
// data = Buffer.from(JSON.stringify(payload)).toString('base64');
// event = {
//   data
// };
// manage(event, '', (resp) => {
//   console.log(resp);
//   console.log('executed');
// });

// // associate itinerary item
// payload = {
//   domain: 'admin',
//   action: 'itinerary',
//   command: 'read',
//   payload: {
//     id: '0d84ac76-5d00-4969-9312-440900fa6eb3'
//   },
//   user: {
//     id: "091e8b52-8506-4512-b75e-149ee51c4f04",
//     username: "tester",
//     fields: {
//       custom: "fields"
//     }
//   }
// };
// data = Buffer.from(JSON.stringify(payload)).toString('base64');
// event = {
//   data
// };
// manage(event, '', (resp) => {
//   console.log(resp);
//   console.log('executed');
// });

// associate itinerary item
// payload = {
//   domain: 'admin',
//   action: 'event',
//   command: 'create',
//   payload: {
//     name: "event-numero-2",
//     website: "www.example.com",
//     start_date: "2020-08-21 08:00:00",
//     end_date: "2020-08-22 17:00:00",
//     organisation: "d8ad68bd-9fcc-425e-b6ce-46c1c6ea7473"
//   },
//   user: {
//     id: "091e8b52-8506-4512-b75e-149ee51c4f04",
//     username: "tester",
//     fields: {
//       custom: "fields"
//     }
//   }
// };
// data = Buffer.from(JSON.stringify(payload)).toString('base64');
// event = {
//   data
// };

// manage(event, '', (resp) => {
//   console.log(resp);
//   console.log('executed');
// });

// // associate itinerary item
// payload = {
//   domain: 'admin',
//   action: 'event',
//   command: 'read',
//   payload: {
//     id: '3b739350-7626-4cf8-8bc7-7fefcc10fce8'
//   },
//   user: {
//     id: "091e8b52-8506-4512-b75e-149ee51c4f04",
//     username: "tester",
//     fields: {
//       custom: "fields"
//     }
//   }
// };
// data = Buffer.from(JSON.stringify(payload)).toString('base64');
// event = {
//   data
// };
// manage(event, '', (resp) => {
//   console.log(resp);
//   console.log('executed');
// });

// get events by id
payload = {
  domain: 'consumer',
  action: 'event',
  command: 'get',
  payload: { organisation: 'd8ad68bd-9fcc-425e-b6ce-46c1c6ea7473' },
  user: {
    id: '091e8b52-8506-4512-b75e-149ee51c4f04',
    username: 'tester',
    fields: { custom: 'fields' },
    token: 'e7c070e8d69b28093154bb7c4ca7602af8bd1cd4'
  },
  socketId: 'XbTiLsd9CmFwzEafAAAA'
};
data = Buffer.from(JSON.stringify(payload)).toString('base64');
event = {
  data
};
manage(event, '', (resp) => {
  console.log(resp);
  console.log('executed');
  process.exit();
});