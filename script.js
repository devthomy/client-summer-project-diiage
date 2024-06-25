document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const artistList = document.getElementById("artistList");

    searchButton.addEventListener("click", async function () {
        const query = searchInput.value.trim();
        if (!query) {
            searchInput.classList.add("border-red-500");
            alert("Veuillez entrer un nom d'artiste.");
            return;
        }
        searchInput.classList.remove("border-red-500");

        const apiUrl = `https://192.168.1.39:7136/api/deezer/artist/${query}`;
        await fetchData(apiUrl, displayArtist);
    });

    artistList.addEventListener("click", function (event) {
        if (event.target.classList.contains("album-cover")) {
            const albumId = event.target.dataset.albumId;
            const albumButton = event.target;
            albumButton.textContent = "Chargement des titres...";
            fetchTracks(albumId, albumButton);
        }
    });

    async function fetchData(apiUrl, callback) {
        try {
            searchButton.disabled = true;
            searchButton.textContent = "Chargement...";
            artistList.innerHTML = '<div class="flex justify-center"><div class="loader"></div></div>';

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Échec de la récupération des données.`);
            }
            const data = await response.json();
            callback(data);
        } catch (error) {
            console.error(error);
            artistList.innerHTML = `<p class="text-red-500">Erreur lors de la récupération des données: ${error.message}</p>`;
        } finally {
            searchButton.disabled = false;
            searchButton.textContent = "Rechercher";
        }
    }

    function displayArtist(artist) {
        if (!artist.albums.length) {
            artistList.innerHTML = `<p class="text-gray-600">Aucun album trouvé pour cet artiste.</p>`;
            return;
        }
        artistList.innerHTML = artist.albums
            .map(
                (album) => `
                <div class="p-4 border border-gray-300 rounded-lg mb-4 animate-fade-in bg-white shadow">
                    <div class="flex items-center mb-2 justify-between">
                        <div class="flex items-center">
                            <img src="${album.cover || "default-album-cover-url"}" alt="${album.title}" class="rounded w-16 h-16 object-cover mr-4 shadow-lg" />
                            <span class="text-lg font-medium">${album.title}</span>
                        </div>
                        <button
                            data-album-id="${album.id}"
                            class="album-cover inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-600"
                        >
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                                Voir les titres
                            </span>
                        </button>
                    </div>
                    <ul class="mt-2 ml-4 list-disc album-tracks" id="tracks-${album.id}"></ul>
                </div>
            `
            )
            .join("");
    }

    async function fetchTracks(albumId, albumButton) {
        const apiUrl = `https://192.168.1.39:7136/api/deezer/album/${albumId}/tracks`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Échec de la récupération des titres.`);
            }
            const tracks = await response.json();
            displayTracks(albumId, tracks);
        } catch (error) {
            console.error(error);
            document.getElementById(`tracks-${albumId}`).innerHTML = `<p class="text-red-500">Erreur lors de la récupération des titres: ${error.message}</p>`;
        } finally {
            albumButton.textContent = "Voir les titres";
        }
    }

    function displayTracks(albumId, tracks) {
        const trackList = document.getElementById(`tracks-${albumId}`);
        if (!tracks.length) {
            trackList.innerHTML = `<p class="text-gray-600">Aucun titre trouvé pour cet album.</p>`;
            return;
        }
        trackList.innerHTML = tracks
            .map(track => `<li>${track.title}</li>`)
            .join("");
    }
});
