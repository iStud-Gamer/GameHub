import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyAowHU0yK0ircTTHKxT_cKQGFcpePDHUO4",
    authDomain: "gamehub-61680.firebaseapp.com",
    projectId: "gamehub-61680",
    storageBucket: "gamehub-61680.firebasestorage.app",
    messagingSenderId: "1063927769751",
    appId: "1:1063927769751:web:b900d70de0bc53916e17d2"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);


export {
    app,
    db,
    auth,
    storage
};
