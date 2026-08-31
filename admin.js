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
   IMGBB
======================================== */

const IMGBB_API_KEY =
    "1b233f965f549946e66f1f0ada055aff";



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
    document.getElementById(
        "edit-game-description"
    );

const editGameIconFile =
    document.getElementById(
        "edit-game-icon-file"
    );

const editPreviewImage =
    document.getElementById(
        "edit-preview-image"
    );

const editGameDownload =
    document.getElementById(
        "edit-game-download"
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


let editingGameId =
    null;



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

        try {

            await signOut(auth);

        } catch (error) {

            console.error(error);

        }

    }
);



/* ========================================
   IMAGE PREVIEW - ADD
======================================== */

gameIconFile.addEventListener(
    "change",
    () => {

        const file =
            gameIconFile.files[0];


        if (!file) {

            gameIconPreview.src =
                "";

            gameIconPreview.style.display =
                "none";

            return;
        }


        if (
            !file.type.startsWith("image/")
        ) {

            gameMessage.textContent =
                "Please select a valid image.";

            gameIconFile.value =
                "";

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
   IMAGE PREVIEW - EDIT
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

            editGameIconFile.value =
                "";

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
   UPLOAD IMAGE TO IMGBB
======================================== */

async function uploadToImgBB(file) {

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
       32 MB safety limit
    */

    if (
        file.size > 32 * 1024 * 1024
    ) {

        throw new Error(
            "Image must be smaller than 32 MB."
        );

    }


    if (
        IMGBB_API_KEY ===
        "YOUR_IMGBB_API_KEY"
    ) {

        throw new Error(
            "ImgBB API key has not been added."
        );

    }


    const formData =
        new FormData();


    formData.append(
        "key",
        IMGBB_API_KEY
    );


    formData.append(
        "image",
        file
    );


    const response =
        await fetch(
            "https://api.imgbb.com/1/upload",
            {
                method:
                    "POST",

                body:
                    formData
            }
        );


    const data =
        await response.json();


    if (
        !response.ok ||
        !data.success
    ) {

        console.error(
            "ImgBB error:",
            data
        );


        throw new Error(
            data?.error?.message ||
            "ImgBB upload failed."
        );

    }


    /*
       Direct image URL
    */

    return data.data.display_url ||
        data.data.url;

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

            addGameButton.disabled =
                true;

            addGameButton.textContent =
                "Uploading image...";


            /*
               Upload to ImgBB
            */

            const icon =
                await uploadToImgBB(
                    imageFile
                );


            addGameButton.textContent =
                "Adding game...";


            /*
               Save URL to Firestore
            */

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


            /*
               Clear form
            */

            gameName.value =
                "";

            gameVersion.value =
                "";

            gameDescription.value =
                "";

            gameDownload.value =
                "";

            gameIconFile.value =
                "";


            gameIconPreview.src =
                "";

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


                text.appendChild(
                    title
                );

                text.appendChild(
                    version
                );


                info.appendChild(
                    image
                );

                info.appendChild(
                    text
                );


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
   BUTTON EVENTS
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
           Show existing image
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
           Clear new image
        */

        editGameIconFile.value =
            "";


        editMessage.textContent =
            "";


        editSection.style.display =
            "block";


        editSection.scrollIntoView({
            behavior:
                "smooth",

            block:
                "center"
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
               Keep current image
            */

            let icon =
                currentGame.icon ||
                "";


            /*
               Replace image if selected
            */

            const newImage =
                editGameIconFile.files[0];


            if (newImage) {

                saveEditButton.textContent =
                    "Uploading image...";


                icon =
                    await uploadToImgBB(
                        newImage
                    );

            }


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
