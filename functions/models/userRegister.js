// สำหรับ network requests
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// เชื่อมต่อ firebase
const firestore = require('../firebase-config/firebase');
const config = require('../config');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
const LINE_HEADER = {
  'Content-Type': 'application/json',
    Authorization: `Bearer ${config.accessToken}`,
    'X-Line-Retry-Key': uuidv4(),
};

function payload(userReq, uid) {
  replyRegisterRequest(uid, {
      type: 'flex',
      altText: 'ไม่รองรับการแสดงผลบนอุปกรณ์นี้',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: 'มีคำขอลงทะเบียนผู้ใช้งาน',
              weight: 'bold',
              size: 'sm',
              color: '#AAAAAA',
            },
          ],
        },
        hero: {
          type: 'image',
          url: 'https://matzeeya.github.io/LINEBOT-Inventory/images/Borrow.png',
          size: 'full',
          aspectRatio: '20:13',
          aspectMode: 'fit',
          backgroundColor: '#E14B4BFF',
          action: {
            type: 'uri',
            label: 'Action',
            uri: 'https://linecorp.com/',
          },
        },
        body: {
          type: 'box',
          layout: 'horizontal',
          spacing: 'md',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'มีคำขอลงทะเบียนผู้ใช้งาน',
                  size: 'sm',
                  gravity: 'top',
                },
              ],
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              action: {
                type: 'uri',
                label: 'ดูรายละเอียด',
                uri: `${config.LIFF_URL}/verify/${userReq}`,
              },
              style: 'primary',
            },
          ],
        },
      },
  });
}

const replyRegisterRequest = (uid, payload) => {
  axios({
    method: 'post',
    url: `${LINE_MESSAGING_API}/message/multicast`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      to: uid,
      messages: [payload],
    }),
  });
};

function getAdminUid(userReq) {
  const uid = [];
  const docRef = firestore.collection('userRegister');
  const query = docRef
    .where('type', '==', 'staff');
  query
  .get()
  .then((snapshot) =>{
    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        uid.push(doc.data().userid);
      });
      payload(userReq, uid);
    }
  })
  .catch((err) =>{
    console.log(err);
  });
}

module.exports={ getAdminUid };