const axios = require('axios');
const config = require('../config');
const check = require('../models/checkItem');
const search = require('../models/searchItem');
const borrow = require('../models/borrowItem');
const back = require('../models/returnItem');
const repair = require('../models/repairItem');
const sell = require('../models/sellItem');

const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.accessToken}`
};

const linebot = async(req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  let event = req.body.events[0];
  if(req.method === "POST"){
    if(event.message.type === "text"){
      var msg = event.message.text.split(": ");
      if(msg[1] !== "null"){
        if(msg[0] === "หมายเลขครุภัณฑ์"){
          check.getdata(req, res, msg[1]);
        }else if(msg[0] === "ข้อมูลครุภัณฑ์" || msg[0] === "เพิ่มข้อมูลครุภัณฑ์หมายเลข"){
          search.getdata(req, res, msg[1]);
        }else if(msg[0] === "ยืมครุภัณฑ์"){
          borrow.getdata(req, res, msg[1]);
        }else if(msg[0] === "คืนครุภัณฑ์"){
          back.getdata(req, res, msg[1]);
        }else if(msg[0] === "แจ้งซ่อมครุภัณฑ์"){
          repair.getdata(req, res, msg[1]);
        }else if(msg[0] === "จำหน่ายครุภัณฑ์"){
          sell.getdata(req, res, msg[1]);
        }else{
          postToDialogflow(req);
        }
      }else{
        reply(event.replyToken, { type: "text", text: "กรุณาสแกนใหม่อีกครั้งค่ะ"});
      }
    }else{
      reply(event.replyToken, { type: "text", text: "สวัสดีค่ะ"});
    }
  }
  return res.status(200).send('done');
};

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

const postToDialogflow = payloadRequest => {
  payloadRequest.headers.host = "dialogflow.cloud.google.com"
  axios({
    url: config.dialogflow,
    headers: payloadRequest.headers,
    method: "post",
    data: payloadRequest.body
  })
};

module.exports = {
  linebot,
};