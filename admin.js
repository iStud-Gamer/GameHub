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
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



/* ========================================
   LOGIN
======================================== */

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



/* ========================================
   ADD GAME
======================================== */

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



/* ========================================
   GAME LIST
======================================== */

const adminGames =
    document.getElementById("admin-games");


const adminGameCount =
    document.getElementById("admin-game-count");



/* ========================================
   EDIT GAME
======================================== */

const editSection =
    document.getElementById("edit-section");


const editGameName =
    document.getElementById("edit-game-name");


const editGameVersion =
    document.getElementById("edit-game-version");


const editGameDescription =
    document.getElementById(
        "edit-game-description"
    );


const editGameIcon =
    document.getElementById("edit-game-icon");


const editGameDownload =
    document.getElementById(
        "edit-game-download"
    );


const editPreviewImage =
    document.getElementById(
        "edit-preview-image"
    );


const saveEditButton =
    document.getElementById(
        "save-edit-btn"
    );


const cancelEditButton =
    document.getElementById(
        "cancel-edit-btn"
    );


const editMessage =
    document.getElementById(
        "edit-message"
    );


let editingGameId = null;



/* ========================================
   LOGIN
======================================== */

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

            loginButton.disabled =
                true;


            loginButton.textContent =
                "Logging in...";


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
                "Login failed. Check your email and password.";

        } finally {

            loginButton.disabled =
                false;


            loginButton.textContent =
                "Login";

        }

    }
);



/* ========================================
   AUTH STATE
======================================== */

onAuthStateChanged(
    auth,
    user => {

        if (user) {

            loginSection.style.display =
                "none";


            adminSection.style.display =
                "block";


            loadGames();

        } else {

            loginSection.style.display =
                "block";


            adminSection.style.display =
                "none";


            closeEdit();

        }

    }
);



/* ========================================
   LOGOUT
======================================== */

logoutButton.addEventListener(
    "click",
    async () => {

        await signOut(auth);

    }
);



/* ========================================
   ADD GAME
======================================== */

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

            addGameButton.disabled =
                true;


            addGameButton.textContent =
                "Adding...";


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


            await loadGames();


        } catch (error) {

            console.error(error);


            gameMessage.textContent =
                "Failed to add game.";

        } finally {

            addGameButton.disabled =
                false;


            addGameButton.textContent =
                "Add Game";

        }

    }
);



/* ========================================
   LOAD GAMES
======================================== */

async function loadGames() {

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


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "admin-game";


                item.innerHTML = `

                    <div
                        class="admin-game-info"
                    >

                        <img
                            src="${game.icon || "https://placehold.co/100"}"
                            alt="${game.name || "Game"}"
                        >

                        <div>

                            <h3>
                                ${game.name || "Unnamed Game"}
                            </h3>

                            <p>
                                Version
                                ${game.version || "Unknown"}
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


                adminGames.appendChild(item);

            }
        );


        attachGameButtons();


    } catch (error) {

        console.error(error);


        adminGames.innerHTML =
            "<p>Failed to load games.</p>";

    }

}



/* ========================================
   BUTTON EVENTS
======================================== */

function attachGameButtons() {


    document
        .querySelectorAll(".edit-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openEdit(
                        button.dataset.id
                    );

                }
            );

        });


    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteGame(
                        button.dataset.id
                    );

                }
            );

        });

}



/* ========================================
   OPEN EDIT FORM
======================================== */

async function openEdit(gameId) {

    try {

        const gameRef =
            doc(
                db,
                "games",
                gameId
            );


        const gameSnapshot =
            await getDoc(gameRef);


        if (
            !gameSnapshot.exists()
        ) {

            alert(
                "Game not found."
            );

            return;

        }


        const game =
            gameSnapshot.data();


        editingGameId =
            gameId;


        editGameName.value =
            game.name || "";


        editGameVersion.value =
            game.version || "";


        editGameDescription.value =
            game.description || "";


        editGameIcon.value =
            game.icon || "";


        editGameDownload.value =
            game.download || "";


        updatePreview();


        editMessage.textContent =
            "";


        editSection.style.display =
            "block";


        editSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (error) {

        console.error(error);


        alert(
            "Failed to open game."
        );

    }

}



/* ========================================
   IMAGE PREVIEW
======================================== */

editGameIcon.addEventListener(
    "input",
    updatePreview
);


function updatePreview() {

    const url =
        editGameIcon.value.trim();


    if (!url) {

        editPreviewImage.style.display =
            "none";

        return;

    }


    editPreviewImage.src =
        url;


    editPreviewImage.style.display =
        "block";

}



/* ========================================
   SAVE EDIT
======================================== */

saveEditButton.addEventListener(
    "click",
    async () => {

        if (!editingGameId) {

            return;

        }


        const name =
            editGameName.value.trim();


        const version =
            editGameVersion.value.trim();


        const description =
            editGameDescription.value.trim();


        const icon =
            editGameIcon.value.trim();


        const download =
            editGameDownload.value.trim();


        if (
            !name ||
            !version ||
            !description ||
            !icon ||
            !download
        ) {

            editMessage.textContent =
                "Please fill in all fields.";

            return;

        }


        try {

            saveEditButton.disabled =
                true;


            saveEditButton.textContent =
                "Saving...";


            const gameRef =
                doc(
                    db,
                    "games",
                    editingGameId
                );


            await updateDoc(
                gameRef,
                {

                    name: name,

                    version: version,

                    description: description,

                    icon: icon,

                    download: download

                }
            );


            editMessage.textContent =
                "Game updated successfully!";


            await loadGames();


            setTimeout(
                closeEdit,
                1000
            );


        } catch (error) {

            console.error(error);


            editMessage.textContent =
                "Failed to update game.";

        } finally {

            saveEditButton.disabled =
                false;


            saveEditButton.textContent =
                "Save Changes";

        }

    }
);



/* ========================================
   CANCEL EDIT
======================================== */

cancelEditButton.addEventListener(
    "click",
    closeEdit
);


function closeEdit() {

    editingGameId = null;


    editSection.style.display =
        "none";


    editMessage.textContent =
        "";

}



/* ========================================
   DELETE GAME
======================================== */

async function deleteGame(gameId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this game?"
        );


    if (!confirmed) {

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


        await loadGames();


    } catch (error) {

        console.error(error);


        alert(
            "Failed to delete game."
        );

    }

}
