chrome.runtime.onMessage.addListener(
    // reveal letter on message from popup.js
    function(request, sender, sendResponse) {
        main();
    }
  );

function setRevealedTile(tileIndex) {
    if(!window.tilesRevealed) {
        window.tilesRevealed = []
    }
    window.tilesRevealed.push(tileIndex)
}

function removeRevealedTiles(hiddenTiles) {
    if(window.tilesRevealed) {
        window.tilesRevealed.forEach(x => hiddenTiles.splice(hiddenTiles.indexOf(x), 1));
    }
}

function removeCorrectlyGuessedTiles(evaluations, hiddenTiles) {  
    for (let i = 0; i < evaluations.length; i++) {
        if (evaluations[i] == null)
            break;
        for (let j = 0; j < evaluations[i].length; j++) {
            if (evaluations[i][j] == "correct") {
                const index = hiddenTiles.indexOf(j);
                if (index > -1) {
                    hiddenTiles.splice(index, 1);
                }
            }
        }
    }
    
}

function getTileToReveal(lastGuessIndex, state) {
    let hiddenTiles = [0,1,2,3,4];
    if (lastGuessIndex != -1)
        removeCorrectlyGuessedTiles(state.evaluations, hiddenTiles);
    removeRevealedTiles(hiddenTiles);
    console.log("Tiles left to be revealed", hiddenTiles);
    // randomly choose any tile out of the remaining tiles to be revealed
    const tileIndex = hiddenTiles[Math.floor(Math.random() * hiddenTiles.length)];
    setRevealedTile(tileIndex)
    return tileIndex;
}

function main() {
    state =  JSON.parse(window.localStorage["nyt-wordle-state"])
    nextRowIndex = state.rowIndex
    tileToReveal = getTileToReveal(nextRowIndex - 1, state)
    if (tileToReveal !== undefined) {
        console.log("Revealing tile",tileToReveal)
        tile = document.querySelector("body > game-app")
                .shadowRoot.querySelector("#board > game-row:nth-child(" + (nextRowIndex + 1) + ")")
                .shadowRoot.querySelector("div > game-tile:nth-child(" + (tileToReveal + 1) + ")")
                .shadowRoot.querySelector("div")
        tile.innerText = state.solution[tileToReveal]
        tile.setAttribute("data-state", "correct")
    } else {
        console.log("All tiles already revealed");
    }
}
