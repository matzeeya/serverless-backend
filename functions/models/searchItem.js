// สำหรับ network requests
const axios = require('axios');

// เชื่อมต่อ firebase
const firestore = require("../../firebase-config/node/firebase");
var config = require('../config');

const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.accessToken}`
};

function searchInventory(req, res, doc) { 
  let room = "";
  const event = req.body.events[0];
  const search = doc.room.search("ห้อง");
  if(search >= 0){
    const splitRoom = doc.room.split("ห้อง ");
    room = splitRoom[1];
  }else{
    room = doc.room;
  }
  reply(event.replyToken, { 
      type: 'flex',
      altText: 'ไม่รองรับการแสดงผลบนอุปกรณ์นี้',
      contents: {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "รายละเอียดครุภัณฑ์",
              "align": "center"
            }
          ]
        },
        "hero": {
          "type": "image",
          "url": 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG',
          "size": "full",
          "aspectRatio": "1.51:1",
          "aspectMode": "cover"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "หมายเลขครุภัณฑ์: " + doc.item_code
            },
            {
              "type": "text",
              "text": "ชื่อรายการ: " + doc.name
            },
            {
              "type": "text",
              "text": "S/N: " + doc.serial
            },
            {
              "type": "text",
              "text": "ยี่ห้อ: " + doc.brand
            },
            {
              "type": "text",
              "text": "สถานที่จัดเก็บ: " + room
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "ดูรายละเอียดเพิ่มเติม...",
                "uri": `${config.LIFF_URL}/viewdata/${doc.item_code}`
              },
              "style": "primary"
            }
          ]
        }
      }
  });
  return res.end();
}
  
const reply = (replyToken, payload) => {
  axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      replyToken: replyToken,
      messages: [payload]
    })
  })
};

function getdata(req, res, id){
  // let code;
  // const decode = id.search("eng");
  // if(decode >= 0){
  //   code = decodeItem(id);
  //   console.log("decode "+code);
  // }else{
  //   code = id;
  // }
  let encode = btoa(id);
  console.log("encode " + encode);
  let code = decodeItem(encode);
  console.log("decode " + code);
  axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + id)
    .then(doc => {
      let item = doc.data[0];
      searchInventory(req, res, item);
    })
    .catch(err => {
      console.log(err);
    })
}

function decodeItem(code){

  // code = code.replace('eng','วศ.');
  // code = code.replace('m','ว.');
  // code = code.replace('com','คต. ');
  // code = code.replace('ee','ฟฟ. ');
  // code = code.replace('office','สนง. ');
  // code = code.replace('edu','กศ. ');
  // code = code.replaceAll('-','');
  // let str = code.split(' ');
  // let year = str[1].substring(str[1].length - 4);
  return atob(code);
}

module.exports={ getdata };