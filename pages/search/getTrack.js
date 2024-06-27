document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const trackList = document.getElementById("trackList");

    searchButton.addEventListener("click", async function () {
        const query = searchInput.value.trim();
        if (!query) {
            searchInput.classList.add("border-red-500");
            alert("Veuillez entrer un nom de musique.");
            return;
        }
        searchInput.classList.remove("border-red-500");

        const apiUrl = `https://192.168.1.39:7136/api/deezer/track/name/${query}`;
        await fetchData(apiUrl, displayTracks);
    });

    async function fetchData(apiUrl, callback) {
        try {
            searchButton.disabled = true;
            searchButton.textContent = "Chargement...";
            trackList.innerHTML =
                '<div class="flex justify-center"><div class="loader border-4 border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div></div>';

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Échec de la récupération des données.`);
            }
            const data = await response.json();
            callback(data);
        } catch (error) {
            console.error(error);
            trackList.innerHTML = `<p class="text-red-500">Erreur lors de la récupération des données: ${error.message}</p>`;
        } finally {
            searchButton.disabled = false;
            searchButton.textContent = "Rechercher";
        }
    }

    function displayTracks(tracks) {
        if (!tracks || tracks.length === 0) {
            trackList.innerHTML = `<p class="text-gray-400">Aucune musique trouvée.</p>`;
            return;
        }

        trackList.innerHTML = tracks
            .map(
                (track) => `
                    <div class="border border-gray-700 rounded-lg overflow-hidden mb-4 p-4 bg-gray-800">
                        <div class="flex items-center justify-between">
                            <span>${track.title} - ${track.artist.name}</span>
                            <div class="flex space-x-2">
                                <span>${formatDuration(track.duration)}mn</span>
                                <div>
                                    <button class="play-button" data-preview="${track.preview}">▶️</button>
                                    <button class="stop-button">⏹️</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            )
            .join("");

        setupAudioControls();
    }

    function setupAudioControls() {
        let currentAudio = null;

        document.querySelectorAll(".play-button").forEach((button) => {
            button.addEventListener("click", () => {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                currentAudio = new Audio(button.dataset.preview);
                currentAudio.play();
            });
        });

        document.querySelectorAll(".stop-button").forEach((button) => {
            button.addEventListener("click", () => {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentAudio = null;
                }
            });
        });
    }

    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }
});
