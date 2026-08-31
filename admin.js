import {
    auth,
    db,
    storage
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


import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";



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

const gameIconFile =
    document.getElementById("game-icon-file");

const gameIconPreview =
    document.getElementById("game-icon-preview");

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
    document.getElementById("edit-game-description");

const editGameIconFile =
    document.getElementById("edit-game-icon-file");

const editPreviewImage =
    document.getElementById("edit-preview-image");

const editGameDownload =
    document.getElementById("edit-game-download");

const saveEditButton =
    document.getElementById("save-edit-btn");

const cancelEditButton =
    document.getElementById("cancel-edit-btn");

const editMessage =
    document.getElementById("edit-message");


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

            loginButton.disabled = true;

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

            loginButton.disabled = false;

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

        try {

            await signOut(auth);

        } catch (error) {

            console.error(error);

        }

    }
);



/* ========================================
   ADD IMAGE PREVIEW
======================================== */

gameIconFile.addEventListener(
    "change",
    () => {

        const file =
            gameIconFile.files[0];


        if (!file) {

            gameIconPreview.style.display =
                "none";

            gameIconPreview.src = "";

            return;
        }


        if (
            !file.type.startsWith("image/")
        ) {

            gameMessage.textContent =
                "Please select a valid image.";

            gameIconFile.value = "";

            return;
        }


        const previewURL =
            URL.createObjectURL(file);


        gameIconPreview.src =
            previewURL;

        gameIconPreview.style.display =
            "block";

    }
);



/* ========================================
   EDIT IMAGE PREVIEW
======================================== */

editGameIconFile.addEventListener(
    "change",
    () => {

        const file =
            editGameIconFile.files[0];


        if (!file) {
            return;
        }


        if (
            !file.type.startsWith("image/")
        ) {

            editMessage.textContent =
                "Please select a valid image.";

            editGameIconFile.value = "";

            return;
        }


        const previewURL =
            URL.createObjectURL(file);


        editPreviewImage.src =
            previewURL;

        editPreviewImage.style.display =
            "block";

    }
);



/* ========================================
   UPLOAD IMAGE
======================================== */

async function uploadGameIcon(file) {

    if (!file) {

        throw new Error(
            "No image selected."
        );

    }


    if (
        !file.type.startsWith("image/")
    ) {

        throw new Error(
            "Please select a valid image."
        );

    }


    /*
       Maximum size: 5 MB
    */

    if (
        file.size > 5 * 1024 * 1024
    ) {

        throw new Error(
            "Image must be smaller than 5 MB."
        );

    }


    /*
       Get file extension
    */

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    /*
       Generate unique filename
    */

    const fileName =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}.${extension}`;


    /*
       Storage location
    */

    const imageRef =
        ref(
            storage,
            `game-icons/${fileName}`
        );


    /*
       Upload
    */

    await uploadBytes(
        imageRef,
        file
    );


    /*
       Get URL
    */

    const downloadURL =
        await getDownloadURL(
            imageRef
        );


    return downloadURL;

}



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

        const download =
            gameDownload.value.trim();

        const imageFile =
            gameIconFile.files[0];


        if (
            !name ||
            !version ||
            !description ||
            !download ||
            !imageFile
        ) {

            gameMessage.textContent =
                "Please fill in all fields and select an image.";

            return;
        }


        try {

            addGameButton.disabled = true;

            addGameButton.textContent =
                "Uploading image...";


            const icon =
                await uploadGameIcon(
                    imageFile
                );


            addGameButton.textContent =
                "Adding game...";


            await addDoc(
                collection(
                    db,
                    "games"
                ),
                {

                    name:
                        name,

                    version:
                        version,

                    description:
                        description,

                    icon:
                        icon,

                    download:
                        download,

                    createdAt:
                        serverTimestamp()

                }
            );


            gameMessage.textContent =
                "Game added successfully!";


            gameName.value = "";

            gameVersion.value = "";

            gameDescription.value = "";

            gameDownload.value = "";

            gameIconFile.value = "";


            gameIconPreview.src = "";

            gameIconPreview.style.display =
                "none";


            await loadGames();


        } catch (error) {

            console.error(
                "ADD GAME ERROR:",
                error
            );


            gameMessage.textContent =
                error.message ||
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


        adminGames.innerHTML =
            "";


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


                const info =
                    document.createElement(
                        "div"
                    );


                info.className =
                    "admin-game-info";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    game.icon ||
                    "https://placehold.co/100";


                image.alt =
                    game.name ||
                    "Game";


                image.onerror =
                    () => {

                        image.src =
                            "https://placehold.co/100";

                    };


                const text =
                    document.createElement(
                        "div"
                    );


                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    game.name ||
                    "Unnamed Game";


                const version =
                    document.createElement(
                        "p"
                    );


                version.textContent =
                    `Version ${game.version || "Unknown"}`;


                text.appendChild(title);

                text.appendChild(version);


                info.appendChild(image);

                info.appendChild(text);


                const actions =
                    document.createElement(
                        "div"
                    );


                actions.className =
                    "admin-game-actions";


                const editButton =
                    document.createElement(
                        "button"
                    );


                editButton.className =
                    "edit-btn";

                editButton.dataset.id =
                    gameDoc.id;

                editButton.textContent =
                    "Edit";


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.className =
                    "delete-btn";

                deleteButton.dataset.id =
                    gameDoc.id;

                deleteButton.textContent =
                    "Delete";


                actions.appendChild(
                    editButton
                );

                actions.appendChild(
                    deleteButton
                );


                item.appendChild(
                    info
                );

                item.appendChild(
                    actions
                );


                adminGames.appendChild(
                    item
                );

            }
        );


        attachGameButtons();


    } catch (error) {

        console.error(
            "LOAD GAMES ERROR:",
            error
        );


        adminGames.innerHTML =
            "<p>Failed to load games.</p>";

    }

}



/* ========================================
   GAME BUTTONS
======================================== */

function attachGameButtons() {

    document
        .querySelectorAll(".edit-btn")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openEdit(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(".delete-btn")
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

}



/* ========================================
   OPEN EDIT
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
            await getDoc(
                gameRef
            );


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


        editGameDownload.value =
            game.download || "";


        /*
           Show current icon
        */

        if (game.icon) {

            editPreviewImage.src =
                game.icon;

            editPreviewImage.style.display =
                "block";

        } else {

            editPreviewImage.src =
                "";

            editPreviewImage.style.display =
                "none";

        }


        /*
           Clear replacement image
        */

        editGameIconFile.value =
            "";


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

        const download =
            editGameDownload.value.trim();


        if (
            !name ||
            !version ||
            !description ||
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


            const gameSnapshot =
                await getDoc(
                    gameRef
                );


            if (
                !gameSnapshot.exists()
            ) {

                editMessage.textContent =
                    "Game not found.";

                return;

            }


            const currentGame =
                gameSnapshot.data();


            /*
               Keep existing icon
            */

            let icon =
                currentGame.icon || "";


            /*
               Check for new image
            */

            const newImage =
                editGameIconFile.files[0];


            if (newImage) {

                saveEditButton.textContent =
                    "Uploading image...";


                icon =
                    await uploadGameIcon(
                        newImage
                    );

            }


            /*
               Update Firestore
            */

            saveEditButton.textContent =
                "Saving...";


            await updateDoc(
                gameRef,
                {

                    name:
                        name,

                    version:
                        version,

                    description:
                        description,

                    icon:
                        icon,

                    download:
                        download

                }
            );


            editMessage.textContent =
                "Game updated successfully!";


            await loadGames();


            setTimeout(
                () => {
                    closeEdit();
                },
                1000
            );


        } catch (error) {

            console.error(
                "EDIT GAME ERROR:",
                error
            );


            editMessage.textContent =
                error.message ||
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
   CLOSE EDIT
======================================== */

cancelEditButton.addEventListener(
    "click",
    closeEdit
);


function closeEdit() {

    editingGameId =
        null;


    editSection.style.display =
        "none";


    editMessage.textContent =
        "";


    if (editGameIconFile) {

        editGameIconFile.value =
            "";

    }

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

        console.error(
            "DELETE GAME ERROR:",
            error
        );


        alert(
            "Failed to delete game."
        );

    }

}
