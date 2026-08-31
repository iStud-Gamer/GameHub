import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const gamesContainer =
    document.getElementById("games");

const gameCount =
    document.getElementById("game-count");


async function loadGames() {

    try {

        gamesContainer.innerHTML = `
            <p class="loading">
                Loading games...
            </p>
        `;


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "games"
                )
            );


        const games = [];


        snapshot.forEach(
            gameDoc => {

                games.push({
                    id: gameDoc.id,
                    ...gameDoc.data()
                });

            }
        );


        displayGames(games);


    } catch (error) {

        console.error(
            "Error loading games:",
            error
        );


        gameCount.textContent =
            "0 games";


        gamesContainer.innerHTML = `

            <div class="error-message">

                <p>
                    Couldn't load games.
                </p>

                <small>
                    Please try again later.
                </small>

            </div>

        `;

    }

}



function displayGames(games) {

    gamesContainer.innerHTML = "";


    gameCount.textContent =
        `${games.length} games`;


    if (games.length === 0) {

        gamesContainer.innerHTML = `

            <div class="empty-message">

                <p>
                    No games available.
                </p>

            </div>

        `;

        return;

    }


    games.forEach(
        game => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "game-card";


            card.innerHTML = `

                <div class="game-icon-wrapper">

                    <img
                        src="${game.icon || ""}"
                        alt="${game.name || "Game"}"
                        class="game-icon"
                        loading="lazy"
                    >

                </div>


                <div class="game-content">

                    <div class="game-title-row">

                        <h3>
                            ${game.name || "Unnamed Game"}
                        </h3>

                        <span class="version">
                            v${game.version || "1.0"}
                        </span>

                    </div>


                    <p class="game-description">
                        ${game.description || ""}
                    </p>


                    <a
                        href="${game.download || "#"}"
                        class="download-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download
                    </a>

                </div>

            `;


            gamesContainer.appendChild(
                card
            );

        }
    );

}


loadGames();
