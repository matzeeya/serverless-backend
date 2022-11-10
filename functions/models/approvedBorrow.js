// สำหรับ network requests
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// เชื่อมต่อ firebase
const firestore = require('../../firebase-config/node/firebase');
const config = require('../config');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
const LINE_HEADER = {
  'Content-Type': 'application/json',
    Authorization: `Bearer ${config.accessToken}`,
    'X-Line-Retry-Key': uuidv4(),
};

const replyApprovedBorrow = (uid, payload) => {
  axios({
    method: 'post',
    url: `${LINE_MESSAGING_API}/message/push`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      to: uid,
      messages: [payload],
    }),
  });
};

function getUid(resText) {
  const docRef = firestore.collection('borrows');
  const query = docRef
    .orderBy('created_at','desc')
    .limit(1);
  query
  .get()
  .then((snapshot) =>{
    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        console.log(resText);
        console.log(doc.id);
        replyApprovedBorrow(doc.data().borrow_by,{ 
          type: 'text', 
          text: resText
        });
      });
    }
  })
  .catch((err) =>{
    console.log(err);
  });
}

module.exports={ getUid };