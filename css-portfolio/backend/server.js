const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');
const validator = require('validator');

const app = express();
const PORT = 5000;

const serviceAccount = require('./firebase-key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/submit', async (req, res) => {
    try {
        const formData = req.body;

        const cleanUsername = formData.name ? validator.trim(formData.name) : '';
        const cleanEmail = formData.email ? validator.trim(formData.email) : '';

        if (validator.isEmpty(cleanUsername)) {
            return res.status(400).json({ error: 'Name field cannot be empty.' });
        }

        if (!validator.isEmail(cleanEmail)) {
            return res.status(400).json({ error: 'Please provide a valid email address.' });
        }

        const dataToSave = {
            ...formData,
            submittedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('submissions').add(dataToSave);

        res.json({
            status: 'success',
            message: 'Data successfully saved to Firestore!',
            id: docRef.id
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to save data.',
            error: error.message
        });
    }
});

app.get('/api/submissions', async (req, res) => {
    try {
        const snapshot = await db.collection('submissions').orderBy('submittedAt', 'desc').get();


        const submissions = [];
        snapshot.forEach(doc => {
            submissions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // console.log(submissions);

        res.json({
            status: 'success',
            data: submissions
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/api/contacts', async (req, res) => {
    try {
        const snapshot = await db.collection('submissions')
            .orderBy('submittedAt', 'desc')
            .get();

        const uniqueMap = new Map();

        snapshot.docs.forEach(doc => {
            const data = doc.data();

            if (!uniqueMap.has(data.email)) {
                uniqueMap.set(data.email, {
                    email: data.email,
                    name: data.name || "No Name"
                });
            }
        });

        res.json({
            status: 'success',
            data: Array.from(uniqueMap.values())
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.delete('/api/submissions/:id', async (req, res) => {
    try {
        const docId = req.params.id;

        await db.collection('submissions').doc(docId).delete();

        res.json({
            status: 'success',
            message: 'Document successfully deleted from Firestore!'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete record.',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
