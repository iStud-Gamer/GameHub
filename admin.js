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



/* ELEMENTS */


const loginSection =
    document.getElementById(
        "login-section"
    );


const adminSection =
    document.getElementById(
        "admin-section"
    );


const gamesSection =
    document.getElementById(
        "games-section"
    );


const email =
    document.getElementById(
        "email"
    );


const password =
    document.getElementById(
        "password"
    );


const loginButton =
    document.getElementById(
        "login-btn"
    );


const logoutButton =
    document.getElementById(
        "logout-btn"
    );


const loginMessage =
    document.getElementById(
        "login-message"
    );


const gameName =
    document.getElementById(
        "game-name"
    );


const gameVersion =
    document.getElementById(
        "game-version"
    );


const gameDescription =
    document.getElementById(
        "game-description"
    );


const gameIcon =
    document.getElementById(
        "game-icon"
    );


const gameDownload =
    document.getElementById(
        "game-download"
    );


const addGameButton =
    document.getElementById(
        "add-game-btn"
    );


const gameMessage =
    document.getElementById(
        "game-message"
    );


const adminGames =
    document.getElementById(
        "admin-games"
    );


const adminGameCount =
    document.getElementById(
        "admin-game-count"
    );



/* LOGIN */


loginButton.addEventListener(
    "click",
    async () => {

        const userEmail =
            email.value.trim();


        const userPassword =
            password.value;


        if (
            !userEmail ||
            !userPassword
        ) {

            loginMessage.textContent =
                "Please enter email and password.";

            return;

        }


        try {

            await signInWithEmailAndPassword(
                auth,
                userEmail,
                userPassword
            );


            loginMessage.textContent =
                "Login successful.";


        } catch (error) {

            console.error(error);


            loginMessage.textContent =
                "Login failed: " +
                error.message;

        }

    }
);



/* LOGOUT */


logoutButton.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(error);

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


            gamesSection.style.display =
                "block";


            loadAdminGames();


        } else {

            loginSection.style.display =
                "block";


            adminSection.style.display =
                "none";


            gamesSection.style.display =
                "none";

        }

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
                collection(
                    db,
                    "games"
                ),
                {

                    name: name,

                    version: version,

                    description: description,

                    icon: icon,

                    download: download,

                    createdAt:
                        serverTimestamp()

                }
            );


            gameMessage.textContent =
                "Game added successfully!";


            gameName.value = "";

            gameVersion.value = "";

            gameDescription.value = "";

            gameIcon.value = "";

            gameDownload.value = "";


            loadAdminGames();


        } catch (error) {

            console.error(error);


            gameMessage.textContent =
                "Failed to add game.";

        }

    }
);



/* LOAD ADMIN GAMES */


async function loadAdminGames() {

    adminGames.innerHTML =
        "<p>Loading games...</p>";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "games"
                )
            );


        adminGames.innerHTML = "";


        adminGameCount.textContent =
            `${snapshot.size} games`;


        if (snapshot.empty) {

            adminGames.innerHTML =
                "<p>No games added yet.</p>";

            return;

        }


        snapshot.forEach(
            gameDoc => {

                const game =
                    gameDoc.data();


                const gameItem =
                    document.createElement(
                        "div"
                    );


                gameItem.className =
                    "admin-game";


                gameItem.innerHTML = `

                    <div
                        class="admin-game-info"
                    >

                        <img
                            src="${game.icon}"
                            alt="${game.name}"
                        >

                        <div>

                            <h3>
                                ${game.name}
                            </h3>

                            <p>
                                Version
                                ${game.version}
                            </p>

                        </div>

                    </div>


                    <div
                        class="admin-game-actions"
                    >

                        <button
                            class="edit-btn"
                            data-id="${gameDoc.id}"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            data-id="${gameDoc.id}"
                        >
                            Delete
                        </button>

                    </div>

                `;


                adminGames.appendChild(
                    gameItem
                );

            }
        );



        /* EDIT BUTTONS */


        document
            .querySelectorAll(
                ".edit-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            editGame(
                                button.dataset.id
                            );

                        }
                    );

                }
            );



        /* DELETE BUTTONS */


        document
            .querySelectorAll(
                ".delete-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            deleteGame(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


    } catch (error) {

        console.error(error);


        adminGames.innerHTML =
            "<p>Failed to load games.</p>";

    }

}



/* EDIT GAME */


async function editGame(
    gameId
) {

    const newName =
        prompt(
            "Enter new game name:"
        );


    if (!newName) {

        return;

    }


    try {

        await updateDoc(
            doc(
                db,
                "games",
                gameId
            ),
            {

                name:
                    newName.trim()

            }
        );


        alert(
            "Game updated successfully."
        );


        loadAdminGames();


    } catch (error) {

        console.error(error);


        alert(
            "Failed to update game."
        );

    }

}



/* DELETE GAME */


async function deleteGame(
    gameId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this game?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "games",
                gameId
            )
        );


        alert(
            "Game deleted successfully."
        );


        loadAdminGames();


    } catch (error) {

        console.error(error);


        alert(
            "Failed to delete game."
        );

    }

}
