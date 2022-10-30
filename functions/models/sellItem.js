// สำหรับ network requests
const axios = require('axios');

// เชื่อมต่อ firebase
const firestore = require('../../firebase-config/node/firebase');
const config = require('../config');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.accessToken}`,
};

function sellItem(req, res, doc) {
  let room = '';
  const event = req.body.events[0];
  const search = doc.room.search('ห้อง');
  if (search >= 0) {
    const splitRoom = doc.room.split('ห้อง ');
    room = splitRoom[1];
  } else {
    room = doc.room;
  }
  reply(event.replyToken, {
      type: 'flex',
      altText: 'ไม่รองรับการแสดงผลบนอุปกรณ์นี้',
      contents: {
        type: 'bubble',
        direction: 'ltr',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'รายละเอียดครุภัณฑ์',
              align: 'center',
            },
          ],
        },
        hero: {
          type: 'image',
          url: 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG',
          size: 'full',
          aspectRatio: '1.51:1',
          aspectMode: 'cover',
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'หมายเลขครุภัณฑ์: ' + doc.item_code,
            },
            {
              type: 'text',
              text: 'ชื่อรายการ: ' + doc.name,
            },
            {
              type: 'text',
              text: 'S/N: ' + doc.serial,
            },
            {
              type: 'text',
              text: 'ยี่ห้อ: ' + doc.brand,
            },
            {
              type: 'text',
              text: 'สถานที่จัดเก็บ: ' + room,
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
                label: 'เพิ่มจำหน่ายครุภัณฑ์',
                uri: `${config.LIFF_URL}/addSellList/${doc.item_code}`,
              },
              style: 'primary',
            },
            // {
            //   type: 'button',
            //   action: {
            //     type: 'uri',
            //     label: 'เสร็จสิ้น',
            //     uri: `${config.LIFF_URL}/sellList`,
            //   },
            //   style: 'secondary',
            // },
          ],
        },
      },
  });
  return res.end();
}

const reply = (replyToken, payload) => {
  axios({
    method: 'post',
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      replyToken: replyToken,
      messages: [payload],
    }),
  });
};

function getdata(req, res, id) {
  const event = req.body.events[0];
  let code;
  const decode = id.search('eng');
  if (decode >= 0) {
    code = decodeItem(id);
    console.log('decode '+code);
  } else {
    code = id;
  }
  // axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + code)
  //   .then((doc) => {
  //     let item = doc.data[0];
  //     sellItem(req, res, item);
  //   })
  //   .catch((err) => {
  //     reply(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลครุภัณฑ์'});
  //     console.log(err);
  //   });
  const docRef = firestore.collection('items');
  const query = docRef
    .where('item_code', '==', code)
    .where('status', 'in', ['รอจำหน่าย', 'ใช้งาน']);
  query
  .get()
  .then((snapshot) =>{
    if (!snapshot.empty) { // หากพบข้อมูลและ status = 'รอจำหน่าย','ใช้งาน' สามารถจำหน่ายได้
      snapshot.forEach((doc) => {
        const item = doc.data();
        sellItem(req, res, item);
      });
    } else { // หากไม่พบข้อมูลหรือ status != 'รอจำหน่าย','ใช้งาน' ไม่สามารถจำหน่ายได้
      reply(event.replyToken, {
        type: 'text',
        text: 'ไม่สามารถจำหน่ายได้ กรุณาตรวจสอบอีกครั้งค่ะ',
      });
    }
  })
  .catch((err) =>{
    console.log(err);
  });
}

function decodeItem(code) {
  const arr1= ['eng', 'm', 'com', 'ee', 'off', 'edu'];
  const arr2= ['วศ.', 'ว.', 'คต. ', 'ฟฟ. ', 'สนง. ', 'กศ. '];

  for (let i=0; i<arr1.length; i++) {
    code = code.replace(arr1[i], arr2[i]);
  }
  code = code.replaceAll('-', '');
  const str = code.split(' ');
  const year = str[1].substring(str[1].length - 4); // ตัดปีงบประมาณ
  code = code.replace(year, '/'+year);
  return code;
}

module.exports={ getdata };