import {
    auth,
    db
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const loginSection =
    document.getElementById("login-section");

const adminSection =
    document.getElementById("admin-section");


const email =
    document.getElementById("email");

const password =
    document.getElementById("password");


const loginButton =
    document.getElementById("login-btn");

const logoutButton =
    document.getElementById("logout-btn");


const loginMessage =
    document.getElementById("login-message");

const gameName =
    document.getElementById("game-name");

const gameVersion =
    document.getElementById("game-version");

const gameDescription =
    document.getElementById("game-description");

const gameIcon =
    document.getElementById("game-icon");

const gameDownload =
    document.getElementById("game-download");

const addGameButton =
    document.getElementById("add-game-btn");

const gameMessage =
    document.getElementById("game-message");

/* LOGIN */

loginButton.addEventListener(
    "click",
    async () => {

        try {

            await signInWithEmailAndPassword(
                auth,
                email.value,
                password.value
            );

            loginMessage.textContent =
                "Login successful.";

        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                "Login failed: " + error.message;

        }

    }
);


/* AUTH STATE */

onAuthStateChanged(
    auth,
    user => {

        if (user) {

            loginSection.style.display =
                "none";

            adminSection.style.display =
                "block";

        } else {

            loginSection.style.display =
                "block";

            adminSection.style.display =
                "none";

        }

    }
);


/* LOGOUT */

logoutButton.addEventListener(
    "click",
    async () => {

        await signOut(auth);

    }
);
/* ADD GAME */

addGameButton.addEventListener(
    "click",
    async () => {

        const name =
            gameName.value.trim();

        const version =
            gameVersion.value.trim();

        const description =
            gameDescription.value.trim();

        const icon =
            gameIcon.value.trim();

        const download =
            gameDownload.value.trim();


        if (
            !name ||
            !version ||
            !description ||
            !icon ||
            !download
        ) {

            gameMessage.textContent =
                "Please fill in all fields.";

            return;
        }


        try {

            await addDoc(
                collection(db, "games"),
                {
                    name: name,
                    version: version,
                    description: description,
                    icon: icon,
                    download: download,
                    createdAt: serverTimestamp()
                }
            );


            gameMessage.textContent =
                "Game added successfully!";


            gameName.value = "";
            gameVersion.value = "";
            gameDescription.value = "";
            gameIcon.value = "";
            gameDownload.value = "";


        } catch (error) {

            console.error(error);

            gameMessage.textContent =
                "Failed to add game.";

        }

    }
);
