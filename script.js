import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const gamesContainer =
    document.getElementById("games");


let games = [];


/* LOAD GAMES */

async function loadGames() {

    try {

        const gamesQuery = query(
            collection(db, "games"),
            orderBy("createdAt", "desc")
        );


        const snapshot =
            await getDocs(gamesQuery);


        games = [];


        snapshot.forEach(doc => {

            games.push({
                id: doc.id,
                ...doc.data()
            });

        });


        displayGames(games);


    } catch (error) {

        console.error(error);

        gamesContainer.innerHTML = `
            <p>Couldn't load games.</p>
        `;

    }

}


/* DISPLAY GAMES */

function displayGames(list) {

    gamesContainer.innerHTML = "";


    const gameCount =
        document.getElementById("game-count");


    if (gameCount) {

        gameCount.textContent =
            `${list.length} games`;

    }


    if (list.length === 0) {

        gamesContainer.innerHTML = `
            <p>No games available.</p>
        `;

        return;

    }


    list.forEach(game => {

        const card =
            document.createElement("div");


        card.className =
            "game-card";


        card.innerHTML = `

            <img
                src="${game.icon}"
                alt="${game.name}"
            >

            <div class="game-info">

                <h2>
                    ${game.name}
                </h2>

                <p>
                    ${game.description}
                </p>

                <small>
                    Version ${game.version}
                </small>

                <br><br>

                <a
                    href="${game.download}"
                    class="download-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Download
                </a>

            </div>

        `;


        gamesContainer.appendChild(card);

    });

}


/* START */

loadGames();
