const functions = require('firebase-functions');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
const serviceAccountKey = require('./ServiceAccountKey.json')
 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// ROUTES

// const authRoutes = require('./routes/auth-routes');


// app.use('/auth', authRoutes)


app.get('/', (req, res) => {
    res.send('ok')
})

exports.app = functions.https.onRequest(app);