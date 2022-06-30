const displayGames = document.querySelector("#display-games");
const searchValue = document.querySelector("#searchForm")
const searchButton = document.querySelector("#store-search-link")
const mainTitle = document.querySelector("#main-title")
const steamLogo = document.querySelector(".header-logo")

const getData = async (endpoint, value) => {
    try {
        displayGames.innerHTML = `<div class="loader"></div>`;
        const url = `https://cs-steam-game-api.herokuapp.com/${endpoint}${value}`
        const res = await fetch(url)
        const data = await res.json()
        console.log("data", data) 
        return data
    } catch(err){
        console.log("error: ", err)
    }
}

const renderGames = async(value) => {
    try {
        const data = await getData("games", value);
        displayGames.innerHTML = "";
        data.data.forEach((game) => {
        const newDisplay = document.createElement("div");
        newDisplay.innerHTML = `<div class="game-wrapper">
        <div class="game-cover" onclick="renderDetail(${game.appid})"><img src=${game.header_image} height ="100" width = "100" alt=""></div>
        <div class="game-info">
            <p>${game.name}</p>
            <p>$${game.price}</p>
        </div>
        </div>`
        displayGames.appendChild(newDisplay);
        })
    } catch (err) {
        console.log("error: ", err);
    }
}

const renderGenres = async() => {
    try {
        const data = await getData("genres", "?limit=29");
        const categoryList = document.querySelector(".category-list");
        const categoryInput = categoryList.children[1];
        categoryInput.innerHTML = "";
        data.data.sort((a, b) => (a.name > b.name) ? 1 : -1)
        data.data.forEach((genre) => {
            const newGenre = document.createElement("li");
            newGenre.innerHTML = `<li>
            <input type="checkbox" id="genre" value="${genre.name}">
            <label for="genre"> ${genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}</label><br>
        </li>`
            categoryInput.appendChild(newGenre);
        })
    } catch (err) {
        console.log("error: ", err);
    }
}

const renderDetail = async(appid) => {
    try {
        const data = await getData("single-game", `/${appid}`);
        displayGames.innerHTML = "";
        displayGames.innerHTML = `<div class="game-detail">
        <div class="detail-cover">
            <img src= ${data.data.header_image} alt="">
        </div>
        <div class="detail-info">
            <div class="detail-description">
                <h2>${data.data.name}</h2>
                <p>${data.data.description}</p>
            </div>
            <div class="extra-info">
                <p>🔹Release Date: ${data.data.release_date.slice(0,10)}</p>
                <p>🔹Developer: ${data.data.developer}</p>
            </div>
        </div>
    </div>`
    mainTitle.textContent = "Game Detail"   
    } catch (err) {
        console.log("error: ", err);
    }
}

searchButton.addEventListener("click", () => {
    value = searchValue.value;
    mainTitle.textContent = `Search Results for "${value}"`
    renderGames(`?q=${value}&limit=30`);
})

renderGames("?limit=30");
renderGenres().then(() => {
    const checkbox = document.querySelectorAll("#genre");
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].addEventListener("click", (e) => {
            if (e.target.checked) {
                checkbox.forEach((el) => {
                    if (el !== e) el.checked = false;
                })
                e.target.checked = true;
                const genre = e.target.value;
                renderGames(`?genres=${genre}&limit=30`);
                mainTitle.textContent = `Category "${genre}" (results)`
            }  else {
                renderGames("?limit=30");
                mainTitle.textContent = "All Games"
            }      
      })
    }
})

steamLogo.addEventListener("click", () => {
    renderGames("?limit=30");
    mainTitle.textContent = "All Games"
})
