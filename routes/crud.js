require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const privateKey = process.env.FIREBASE_CREDENTIALS.replace(/\\n/g, '\n');

const serviceAccount = {
  type: "service_account",
  project_id: "simple-crud-app-f67f4",
  private_key_id: "3d4b8787e5b0437545640a0e52a6dc664c6eceb3",
  private_key: privateKey,
  client_email: "firebase-adminsdk-ri5n4@simple-crud-app-f67f4.iam.gserviceaccount.com",
  client_id: "118131279245241181496",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ri5n4%40simple-crud-app-f67f4.iam.gserviceaccount.com"
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

console.log('Firebase Admin SDK initialized');

const db = admin.firestore();

// Create data
router.post('/create', async (req, res) => {
  try {
    const { collection, data } = req.body;
    const docRef = await db.collection(collection).add(data);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Data
router.get('/read/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(doc.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update data
router.put('/update/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const { data } = req.body;
    await db.collection(collection).doc(id).update(data);
    res.status(200).json({ message: 'Document updated successfully' });
  } catch {
    res.status(500).json({ error: err.message });
  }
});

// Delete data
router.delete('/delete/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    await db.collection(collection).doc(id).delete();
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
