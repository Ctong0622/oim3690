// Step 1: An array of five songs
const songs = [
    "Blinding Lights",
    "Levitating",
    "Bad Guy",
    "Blinding Lights (Remix)",
    "Save Your Tears (Remix)"
];

// Step 2: Grab the <ul id="playlist"> from playlist.html
const playlist = document.getElementById("playlist");

// Step 2b: Grab the <p id="songCount"> we'll use to show how many songs there are
const songCount = document.getElementById("songCount");

// Step 2c: A helper that updates the count text to match the list
function updateSongCount() {
    songCount.textContent = `Songs: ${playlist.children.length}`;
}

// Step 3: A helper that creates one <li> for a song and adds it to the list
function addSongToList(song) {
    const li = document.createElement("li");
    li.textContent = song;

    // Step 4: If the song title contains "Remix", mark it
    if (song.includes("Remix")) {
        li.textContent += " 🎧 (Remix)";
    }

    playlist.appendChild(li);
    updateSongCount();
}

// Step 5: Loop through the array and add each starting song to the list
for (const song of songs) {
    addSongToList(song);
}

// Step 6: Grab the new input box and button
const songInput = document.getElementById("songInput");
const addSongBtn = document.getElementById("addSongBtn");

// Step 7: When the button is clicked, add whatever is typed in the input
addSongBtn.addEventListener("click", () => {
    const newSong = songInput.value.trim();

    if (newSong === "") {
        return; // don't add empty songs
    }

    addSongToList(newSong);
    songInput.value = ""; // clear the input for the next song
});
