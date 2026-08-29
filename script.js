const games = [
    {
        name: "Example Game",
        version: "1.0",
        description: "Example game description."
    },
    {
        name: "Another Game",
        version: "2.0",
        description: "Another game description."
    }
];

const gamesContainer = document.getElementById("games");
const search = document.getElementById("search");

function displayGames(list) {

    gamesContainer.innerHTML = "";

    list.forEach(game => {

        const card = document.createElement("div");

        card.innerHTML = `
            <h2>${game.name}</h2>
            <p>Version: ${game.version}</p>
            <p>${game.description}</p>
        `;

        gamesContainer.appendChild(card);
    });
}

displayGames(games);

search.addEventListener("input", () => {

    const query = search.value.toLowerCase();

    const filtered = games.filter(game =>
        game.name.toLowerCase().includes(query)
    );

    displayGames(filtered);
});
