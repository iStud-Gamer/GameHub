import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


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
