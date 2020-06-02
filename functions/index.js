const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

var firebaseConfig = {
    apiKey: "AIzaSyDT5a0t_Ib6P2WU_O4VJEsb8WxNEyoWZ_I",
    authDomain: "socialape-6849e.firebaseapp.com",
    databaseURL: "https://socialape-6849e.firebaseio.com",
    projectId: "socialape-6849e",
    storageBucket: "socialape-6849e.appspot.com",
    messagingSenderId: "221771358210",
    appId: "1:221771358210:web:b60c6448d596545dc4c71b",
    measurementId: "G-FYZ4LPS9DH"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig)

const db = admin.firestore()

app.get('/screams', (req, res) => {
    db.collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data.userHandle,
                createdAt: doc.data().createdAt
            });
        })
        return res.json(screams);
    })
    .catch(err => console.error(err));
})

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db.collection('screams')
        .add(newScream)
        .then(doc => {
            res.json( { message: ` Document ${doc.id} created successfully. `})
        })
        .catch(err => {
            res.status(500).json({error: 'Something went wrong'})
            console.error(err);
        })
});

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx))  return true;
    else return false;
}

// sign up route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    
    let errors = {}

    if(isEmpty(newUser.email)){
        errors.email = 'Must not be empty'
    } else if(!isEmail(newUser.email)){
        errors.email = 'Must be a valid email address'
    }

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty'
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty'

    if(Object.keys(errors).length > 0) return res.status(400).json(errors)


    let token, userId;

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists) {
                return res.status(400).json( { handle: 'this handle is already taken'})
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then( (data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then( (idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            db.doc(`users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({email: 'Email is already in use'})
            }
            return res.status(500).json({error: err.code})
        })
});

exports.api = functions.region('asia-east2').https.onRequest(app);

