const gamesContainer =
    document.getElementById("games");

const gameCount =
    document.getElementById("game-count");


let games = [];


async function loadGames() {

    try {

        const response =
            await fetch("./games.json");


        if (!response.ok) {

            throw new Error(
                "Could not load games.json"
            );

        }


        games =
            await response.json();


        displayGames(games);


    } catch (error) {

        console.error(error);


        gamesContainer.innerHTML = `

            <div class="error-message">

                <p>
                    Couldn't load games.
                </p>

            </div>

        `;

        gameCount.textContent =
            "0 games";

    }

}



function displayGames(list) {

    gamesContainer.innerHTML = "";


    gameCount.textContent =
        `${list.length} games`;


    if (list.length === 0) {

        gamesContainer.innerHTML = `

            <div class="empty-message">

                <p>
                    No games available.
                </p>

            </div>

        `;

        return;

    }



    list.forEach(game => {

        const card =
            document.createElement("article");


        card.className =
            "game-card";


        card.innerHTML = `

            <div class="game-icon-wrapper">

                <img
                    src="${game.icon}"
                    alt="${game.name}"
                    class="game-icon"
                    loading="lazy"
                >

            </div>


            <div class="game-content">

                <div class="game-title-row">

                    <h3>
                        ${game.name}
                    </h3>

                    <span class="version">
                        v${game.version}
                    </span>

                </div>


                <p class="game-description">
                    ${game.description}
                </p>


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


loadGames();
