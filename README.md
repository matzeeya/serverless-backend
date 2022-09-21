# Serverless-backend

### Features

Express.JS to to provide API-routes, Implement by NodeJS and Use Firebase Cloud Function to api

# How to install

Use powershell or cmd and type by order, please see below.

- `git clone https://basicgts@bitbucket.org/basicgts/serverless-backend.git`
- `cd serverless-backend`
  `npm install`
- > First of all. check firebase-sdk ,firebase-tools in your desktop. if not install. You can install by command `npm install -g firebase-tools`
- > login to autentication firebase useraccount in your browser. You can install by command `firebase login`
- > create firebase-config.js and modify value.
  > `cp firebase-config.js.default firebase-config.js`
- > In windows use command `copy firebase-config.js.default firebase-config.js`
- > go to firebase-console. In your project. Click Menu: Project Overview and add app -> choose Web
- > copy project credential to replace all value. In file firebase-config.js Plaese see below.
- > at firebase-config.js file to modify value,

  ```javascript
  module.exports = {
    apiKey: 'xxxx',
    authDomain: 'xxxx.firebaseapp.com',
    databaseURL: 'https://xxxxx.firebaseio.com',
    projectId: 'Your projectId',
    storageBucket: 'xxx.appspot.com',
    messagingSenderId: 'xxx',
    appId: 'xxx',
    measurementId: 'xxx',
  };
  ```

- > update Your projectId in file .firebaserc on this root project.
  ```javascript
      {
       "projects": {
       "default": "Your projectId"
        }
      }
  ```
- > Download serviceAccount.json from your Firebase console and put on path ./functions in this project.
- > install package dependency in this project.
  - `cd functions`
  - `npm install`
- > create config.js and modify value.
  > `cp config.js.default config.js`
  > In windows use command `copy config.js.default config.js`
  > at config.js file to modify value,

  ```javascript
  /* eslint-disable no-unused-vars */
  const config = {
    accessToken: 'xxx', // YOUR LINE TOKEN
    serviceAccountPath: './serviceAccount.json',
    databaseURL: 'xxx.firebaseio.com', // YOUR URL firestore
    bitly: 'xxx', // YOUR bitly token, If u need generated short URL
    dialogflow: 'https://dialogflow.cloud.google.com/v1/integrations/line/webhook/xxx', // YOUR dialogflow webhook
    LIFF_URL: 'https://liff.line.me/xxx', // LIFF
    LIFF_ID: 'xxx' // LIFF
  };
  /* eslint-disable no-unused-vars */
  ```

- > To deploy Please back to root project (serverless-backend) and type command below and enter to deploy function.
- `firebase deploy --only functions`

- `Created file config connect firestore for node`
- > cd firebase-config/node
- > `cp firebase.config.js.default firebase.config.js`

  ```javascript
  const firebase = require('firebase/compat/app');

  require('firebase/compat/firestore');

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'xxx',
    authDomain: 'xxx.firebaseapp.com',
    projectId: 'xxx',
    storageBucket: 'xxx.appspot.com',
    messagingSenderId: 'xxx',
    appId: 'xxx'
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig)
  const database = firebaseApp.firestore();
  module.exports = database;
  ```

- `Created file config connect firestore for Vue.js`
- > cd firebase-config/vue
- > `cp firebase.config.js.default firebase.config.js`

  ```javascript
  /* eslint-disable node/no-unsupported-features/es-syntax */
  // Import the functions you need from the SDKs you need
  import firebase from 'firebase/compat/app';
  import 'firebase/compat/firestore';
  import 'firebase/compat/auth';
  import 'firebase/compat/storage';

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'xxx',
    authDomain: 'xxx.firebaseapp.com',
    projectId: 'xxx',
    storageBucket: 'xxx.appspot.com',
    messagingSenderId: 'xxx',
    appId: 'xxx'
  };

  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const database = firebaseApp.firestore();
  export const auth = firebase.auth();
  export const storage = firebase.storage().ref();
  export default database;
  ```

- `Created LINE config`
- > cd line-config
- > `cp config.js.default config.js`

  ```javascript
  const liffID = 'xxx';
  const liffUrl = 'https://liff.line.me/' + liffID;

  // eslint-disable-next-line prettier/prettier
  module.exports = { liffID, liffUrl };
  ```

- `cd vue-project`
- `npm install`

# How to deploy the hosting in firebase

`npm run build`
`firebase deploy --only hosting`

# How to deploy the Local Emulator hosting in vue.js (local dev)

`npm run build`
`firebase emulators:start --only hosting`

# Test URL for local dev

http://localhost:5000

# How to install the Local Emulator Suite

`firebase init emulators`

# How to deploy function in emulator (local dev)

`firebase emulators:start --only functions`

# How to run (local dev)

`npm run serve`

# Test URL for local dev

http://localhost:3000/api

http://localhost:3000/api/v1/employee/1

# Test URL for Emulators dev

http://localhost:5001/[project-id]/[region]/api/welcome

http://localhost:5001/[project-id]/[region]/api/v1/employee/1
