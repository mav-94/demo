var admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-project-51360.firebaseio.com"
});
const db = admin.firestore();
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { query } = require("express");
const app = express();
app.use(cors({ origin: true }));
//create
app.post('/create', (req, res) => {
  (async () => {
    try {
      await db.collection('items').doc().create({ item: req.body.item });
      const docu = db.collection('items');
      let response = [];
      await docu.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        // eslint-disable-next-line promise/always-return
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            item: doc.data().item
          };
          response.push(selectedItem);
        }
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
});


//read by id
app.get('/read/:itemId', (req, res) => {
  (async () => {
    try {
      const document = db.collection('items').doc(req.params.itemId);
      let item = await document.get();
      let response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
//get all
app.get('/read', (req, res) => {
  (async () => {
    try {
      const document = db.collection('items');
      let response = [];
      await document.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        // eslint-disable-next-line promise/always-return
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            item: doc.data().item
          };
          response.push(selectedItem);
        }
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();
});
//update
app.put('/update/:itemId', (req, res) => {
  (async () => {
    try {
      const document = db.collection('items').doc(req.params.itemId);
      await document.update({
        item: req.body.item
      });
      const docu = db.collection('items');
      let response = [];
      await docu.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        // eslint-disable-next-line promise/always-return
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            item: doc.data().item
          };
          response.push(selectedItem);
        }
      });
      return res.status(200).send(response);
    }
    catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }

  })();

});

//delete
app.delete('/delete/:itemId', (req, res) => {
  (async () => {
    try {
      const document = db.collection('items').doc(req.params.itemId);
      await document.delete();
      const docu = db.collection('items');
      let response = [];
      await docu.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        // eslint-disable-next-line promise/always-return
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            item: doc.data().item
          };
          response.push(selectedItem);
        }
      });
      return res.status(200).send(response);
    }
    catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//demo
app.get('/status', (req, res) => {
  return res.status(200).send('Connected!');
});

exports.app = functions.https.onRequest(app);