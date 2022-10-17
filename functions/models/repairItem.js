// สำหรับ network requests
const axios = require('axios');

// เชื่อมต่อ firebase
// const firestore = require('../../firebase-config/node/firebase');
var config = require('../config');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.accessToken}`
};

function repairItem(req, res, doc) { 
  const event = req.body.events[0];
  const encodeAsset = btoa(doc.item_code);
  reply(event.replyToken, { 
      type: 'flex',
      altText: 'ไม่รองรับการแสดงผลบนอุปกรณ์นี้',
      contents: {
        'type': 'bubble',
        'direction': 'ltr',
        'header': {
          'type': 'box',
          'layout': 'vertical',
          'contents': [
            {
              'type': 'text',
              'text': 'รายละเอียดครุภัณฑ์',
              'align': 'center'
            }
          ]
        },
        'hero': {
          'type': 'image',
          'url': 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG',
          'size': 'full',
          'aspectRatio': '1.51:1',
          'aspectMode': 'cover'
        },
        'body': {
          'type': 'box',
          'layout': 'vertical',
          'contents': [
            {
              'type': 'text',
              'text': 'หมายเลขครุภัณฑ์: ' + doc.item_code
            },
            {
              'type': 'text',
              'text': 'ชื่อรายการ: ' + doc.name
            },
            {
              'type': 'text',
              'text': 'S/N: ' + doc.serial
            },
            {
              'type': 'text',
              'text': 'ยี่ห้อ: ' + doc.brand
            },
            {
              'type': 'text',
              'text': 'สถานที่จัดเก็บ: ' + doc.room
            }
          ]
        },
        'footer': {
          'type': 'box',
          'layout': 'horizontal',
          'contents': [
            {
              'type': 'button',
              'action': {
                'type': 'message',
                'label': 'ถูกต้อง',
                'text': 'บันทึกข้อมูลสำเร็จ'
              },
              'style': 'primary'
            },
            {
              'type': 'button',
              'action': {
                'type': 'uri',
                'label': 'แก้ไข',
                'uri': `${config.LIFF_URL}/editItem?code=${encodeAsset}`
              },
              'style': 'secondary'
            }
          ]
        }
      }
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
      messages: [payload]
    })
  })
};

function getdata(req, res, id){
  axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + id)
    .then(doc => {
      let item = doc.data[0];
      repairItem(req, res, item);
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports={ getdata };