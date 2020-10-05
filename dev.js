require('dotenv').config();
const { manage } = require('./index');
let payload, data, event;
// associate itinerary item
// payload = {
//   domain: 'admin',
//   action: 'item',
//   command: 'create',
//   payload: {
//     itinerary: '0d84ac76-5d00-4969-9312-440900fa6eb3',
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
// payload = {
//   domain: 'consumer',
//   action: 'event',
//   command: 'get',
//   payload: { organisation: 'd8ad68bd-9fcc-425e-b6ce-46c1c6ea7473' },
//   user: {
//     id: '091e8b52-8506-4512-b75e-149ee51c4f04',
//     username: 'tester',
//     fields: { custom: 'fields' },
//     token: 'e7c070e8d69b28093154bb7c4ca7602af8bd1cd4'
//   },
//   socketId: 'XbTiLsd9CmFwzEafAAAA'
// };
add = {
  domain: 'client',
  action: 'poll',
  command: 'add',
  payload: {
    id: "pollid",
    type: "poll",
    question: {
      question: "What do you think of the current scenario?",
      answers: [
        {
          text: "Great",
          order: 1
        },
        {
          text: "OK",
          order: 2
        },
        {
          text: "Disappointing",
          order: 3
        }
      ],
      order: 1,
      time: "2020-10-06 09:05:00"
    }
  }
};
create = {
  domain: 'admin',
  action: 'item',
  command: 'create',
  source: 'tc-local',
  payload: {
    title: "Live stream opinion poll",
    start_date: "2020-09-09 14:00:00",
    end_date: "2020-09-09 17:00:00",
    itinerary: "a6a94e7c-0ec4-4fec-994a-c49a327e8035",
    type: "poll",
    configuration: {
      mode: "live",
      questions: [
        {
          question: "What do you think of the current scenario?",
          answers: [
            {
              text: "Great",
              order: 1
            },
            {
              text: "OK",
              order: 2
            },
            {
              text: "Disappointing",
              order: 3
            }
          ],
          order: 1,
          time: "2020-09-09 14:05:00"
        },
        {
          question: "A second question, really?",
          answers: [
            {
              text: "I love them",
              order: 1
            },
            {
              text: "Get this away",
              order: 2
            },
            {
              text: "Hide it!",
              order: 3
            }
          ],
          order: 2,
          time: "2020-09-09 14:05:00"
        },
        {
          question: "And now a third, make it stop!",
          answers: [
            {
              text: "Yay",
              order: 1
            },
            {
              text: "Whoopdedoo",
              order: 2
            },
            {
              text: "Beautiful",
              order: 3
            }
          ],
          order: 3,
          time: "2020-09-09 16:45:00"
        }
      ]
    }
  }
};
data = Buffer.from(JSON.stringify(create)).toString('base64');
event = {
  data
};
manage(event, '', (resp) => {
  console.log(resp);
  console.log('executed');
  process.exit();
});