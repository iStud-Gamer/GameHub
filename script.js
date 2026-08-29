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


const gameCount =
    document.getElementById("game-count");


async function loadGames() {

    try {

        const gamesQuery =
            query(
                collection(
                    db,
                    "games"
                ),
                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(
                gamesQuery
            );


        gameCount.textContent =
            `${snapshot.size} games`;


        gamesContainer.innerHTML = "";


        if (snapshot.empty) {

            gamesContainer.innerHTML = `
                <p class="loading">
                    No games available.
                </p>
            `;

            return;
        }


        snapshot.forEach(
            gameDoc => {

                const game =
                    gameDoc.data();


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "game-card";


                const icon =
                    game.icon ||
                    "https://placehold.co/200x200?text=Game";


                const name =
                    game.name ||
                    "Unnamed Game";


                const description =
                    game.description ||
                    "No description available.";


                const version =
                    game.version ||
                    "Unknown";


                const download =
                    game.download ||
                    "#";


                card.innerHTML = `

                    <img
                        src="${icon}"
                        alt="${name}"
                        loading="lazy"
                    >

                    <div class="game-info">

                        <h2>
                            ${name}
                        </h2>

                        <p>
                            ${description}
                        </p>

                        <small>
                            Version ${version}
                        </small>

                        <br>

                        <a
                            href="${download}"
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


    } catch (error) {

        console.error(
            "Error loading games:",
            error
        );


        gameCount.textContent =
            "Error";


        gamesContainer.innerHTML = `

            <p class="loading">
                Couldn't load games.
            </p>

        `;

    }

}


loadGames();
