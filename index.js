const Firestore = require('@google-cloud/firestore');
const admin = require('firebase-admin');
const projectId = 'stoked-reality-284921';

const publish = (
  topicName,
  source,
  data = undefined
) => {
  const {PubSub} = require('@google-cloud/pubsub');
  // Instantiates a client
  const pubsub = new PubSub({projectId});

  async function publishMessage() {
    const sourceStr = data ? `-${source}` : '';
    const dataBuffer = Buffer.from(JSON.stringify(!data ? source : data));

    const messageId = await pubsub.topic(`${topicName}${sourceStr}`).publish(dataBuffer);
    return messageId;
  }

  return publishMessage();
};

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.manage = async (event, context, callback) => {
  const message = event && event.data ? JSON.parse(Buffer.from(event.data, 'base64').toString()) : null;
  if (message === null) {
    callback();
  }
  const {domain, action, command, socketId, payload, user, source} = message;
  const db = new Firestore({
    projectId,
  });
  if (message.payload.start_date) {
    message.payload.start_date = Firestore.Timestamp.fromDate(new Date(Date.parse(message.payload.start_date)));
  }
  if (message.payload.end_date) {
    message.payload.end_date = Firestore.Timestamp.fromDate(new Date(Date.parse(message.payload.end_date)));
  }
  switch (command) {
    case 'create':
      try {
        const docRef = db.collection('polls').doc();

        const questionCol = docRef.collection('questions');

        const questions = payload.configuration.questions;
        if (questions) {
          delete payload.configuration.questions;
        }
    
        await docRef.set({
          ...payload,
          addedBy: user.id,
          addedAt: Firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        if (questions) {
          questions.forEach(async (question) => {
            const questionRef = questionCol.doc();
            const answerCol = questionRef.collection('answers');
            question.answers.forEach(async (answer) => {
              const answerRef = answerCol.doc();
              await answerRef.set(answer);
            });
            delete question.answers;
            await questionRef.set(question);
          });
        }
   
        await Promise.all([
          publish('ex-manage', { domain, action, command, payload: { ...payload, id: docRef.id }, user, socketId }),
          publish('ex-gateway', source, { domain, action, command, payload: { ...payload, id: docRef.id }, user, socketId })
        ]);
        callback();
      } catch (error) {
        console.log(error);
        await publish('ex-gateway', source, { error: error.message, domain, action, command, payload, user, socketId });
        callback(0);
      }
      break;
    case 'update':
      try {
        const docRef = db.collection('polls').doc(payload.id);
    
        await docRef.set({
          ...payload,
          updatedBy: user.id,
          updatedAt: Firestore.FieldValue.serverTimestamp()
        }, {
          merge: true
        });
    
        await publish('ex-gateway', source, { domain, action, command, payload: { ...payload }, user, socketId });
        callback();
      } catch (error) {
        console.log(error);
        await publish('ex-gateway', source, { error: error.message, domain, action, command, payload, user, socketId });
        callback(0);
      }
      break;
    case 'add':
      try {
        const docRef = db.collection('polls').doc(payload.id);

        const questionCol = docRef.collection('questions');

        const question = payload.data;

        const answers = [];

        const questionRef = questionCol.doc();
        const answerCol = questionRef.collection('answers');
        const answerSet = [];
        question.answers.forEach((answer) => {
          const answerRef = answerCol.doc();
          answerSet.push(answerRef.set(answer));
          answers.push({
            ...answer,
            id: answerRef.id,
          });
        });
        delete question.answers;
        answerSet.push(questionRef.set({
          ...question,
          addedBy: user.id,
          addedAt: Firestore.FieldValue.serverTimestamp()
        }));

        await Promise.all(answerSet);

        const response = {
          id: payload.id,
          data: { ...question, id: questionRef.id, answers },
        };

        await publish('ex-gateway', source, { domain, action, command, payload: response, user, socketId });
        callback();
      } catch (error) {
        console.log(error);
        await publish('ex-gateway', source, { error: error.message, domain, action, command, payload, user, socketId });
        callback(0);
      }
      break;
    case 'read':
      try {
        const docRef = db.collection('polls').doc(payload.id);
        const poll = await docRef.get();

        if (!poll.exists) {
          throw new Error('item not found');
        }

        let data = poll.data();
        data.questions = {};

        const questionsRef = docRef.collection('questions');
        const questions = await questionsRef.get();
        questions.forEach(async (question) => {
          data.questions[question.id] = question.data();
          const answersRef = questionsRef.doc(question.id).collection('answers');
          const answers = await answersRef.get();
          console.log('getting answers');

          data.questions[question.id].answers = {};
          answers.forEach((answer) => {
            console.log('answer retrieved', answer.data());
            data.questions[question.id].answers[answer.id] = answer.data();
          });

          const responsesRef = questionsRef.doc(question.id).collection('responses');
          const responses = await responsesRef.get();
          console.log('getting responses');

          data.questions[question.id].responses = {};
          responses.forEach((response) => {
            console.log('response retrieved', response.data());
            data.questions[question.id].responses[response.id] = response.data();
          });
        });
        await publish('ex-gateway', source, { domain, action, command, payload: data, user, socketId });
        callback();
      } catch (error) {
        console.log(error);
        await publish('ex-gateway', source, { error: error.message, domain, action, command, payload, user, socketId });
        callback(0);
      }
      break;
    case 'get':
      try {
        const docRef = db.collection('polls').doc(payload.id);
        const poll = await docRef.get();

        if (!poll.exists) {
          throw new Error('item not found');
        }

        let data = poll.data();
        data.questions = {};

        const questionsRef = docRef.collection('questions');
        const questions = await questionsRef.get();
        console.log('questions', questions);
        questions.forEach(async (question) => {
          data.questions[question.id] = { id: question.id, ...question.data() };
          const answersRef = questionsRef.doc(question.id).collection('answers');
          const answers = await answersRef.get();
          console.log('getting answers');

          data.questions[question.id].answers = {};
          answers.forEach((answer) => {
            console.log('answer retrieved', answer.data());
            data.questions[question.id].answers[answer.id] = { id: answer.id, ...answer.data() };
          });

          const responsesRef = questionsRef.doc(question.id).collection('responses');
          const responses = await responsesRef.get();
          console.log('getting responses');

          data.questions[question.id].responses = {};
          responses.forEach((response) => {
            console.log('response retrieved', response.data());
            data.questions[question.id].responses[response.id] = { id: response.id, ...response.data() };
          });
        });

        await publish('ex-gateway', source, { domain, action, command, payload: { id: payload.id, ...data }, user, socketId });
        callback();
      } catch (error) {
        console.log(error);
        await publish('ex-gateway', source, { error: error.message, domain, action, command, payload, user, socketId });
        callback(0);
      }
      break;
    case 'answer':
      // user answers an item
      try {
        if (payload.data.instance) {
          const docRef = db.collection('polls').doc(payload.id);
          const poll = await docRef.get();

          if (!poll.exists) {
            throw new Error('item not found');
          }

          const questionRef = docRef.collection('questions').doc(payload.data.question);
          const answerRef = questionRef.collection('responses').doc(payload.data.answer);
          await answerRef.set({
            responses: firebase.firestore.FieldValue.increment(1),
            respondants: admin.firestore.FieldValue.arrayUnion(user.id)
          }, { merge: true });
          const responsesRef = questionRef.collection('responses');
          const responses = await responsesRef.get();
          payload.data = {
            id: questionRef.id,
          };
          payload.data.responses = {};
          responses.forEach((response) => {
            console.log('response retrieved', response.data());
            const { responses } = response.data();
            payload.responses[response.id] = responses;
          });
        } else {
          throw new Error('question and answer are required');
        }
        await publish('ex-gateway', source, { domain, action, command, payload: { ...payload }, user, socketId });
        callback();
      } catch (err) {
        console.log(err);
        await publish('ex-gateway', source, { error: error.message, domain, action, command, payload, user, socketId });
        callback(0);
      }
      break;
    }
};
