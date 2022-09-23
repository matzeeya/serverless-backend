const axios = require('axios');

const config = require('../config');

const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.accessToken}`
};

const linebot = async(req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  let event = req.body.events[0];
  if(req.method === "POST"){
    if(event.message.type !== "text"){
      if(event.message.type === "image"){
        await reply(event.replyToken, { type: "text", text: "Picture"});
      }else{
        await reply(event.replyToken, { type: "text", text: "Sticker"});
      }
    }else{
      postToDialogflow(req);
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