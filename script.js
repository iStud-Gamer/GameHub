const gamesContainer = document.getElementById("games");

let games = [];

async function loadGames() {
    try {
        const response = await fetch("./games.json");

        if (!response.ok) {
            throw new Error("Could not load games.json");
        }

        games = await response.json();

        displayGames(games);

    } catch (error) {
        console.error(error);

        gamesContainer.innerHTML = `
            <p>Couldn't load games.</p>
        `;
    }
}

function displayGames(list) {

    gamesContainer.innerHTML = "";

    document.getElementById("game-count").textContent =
        `${list.length} games`;

    if (list.length === 0) {
        gamesContainer.innerHTML = `
            <p>No games found.</p>
        `;
        return;
    }

    list.forEach(game => {

        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML = `
            <img src="${game.icon}" alt="${game.name}">

            <div class="game-info">
                <h2>${game.name}</h2>

                <span>${game.category}</span>

                <p>${game.description}</p>

                <small>Version ${game.version}</small>

                <br><br>

                <a href="${game.download}" class="download-btn">
                    Download
                </a>
            </div>
        `;

        gamesContainer.appendChild(card);
    });
}


loadGames();
const categoryButtons =
    document.querySelectorAll(".category");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category =
            button.dataset.category;

        if (category === "All") {

            displayGames(games);

        } else {

            const filteredGames =
                games.filter(game =>
                    game.category === category
                );

            displayGames(filteredGames);
        }

    });

});
