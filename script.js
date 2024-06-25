document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const artistList = document.getElementById("artistList");
    const artistCard = document.getElementById("artistCard");
    const artistImage = document.getElementById("artistImage");
    const artistName = document.getElementById("artistName");
    const artistFans = document.getElementById("artistFans");

    searchButton.addEventListener("click", async function () {
        const query = searchInput.value.trim();
        if (!query) {
            searchInput.classList.add("border-red-500");
            alert("Veuillez entrer un nom d'artiste.");
            return;
        }
        searchInput.classList.remove("border-red-500");

        artistCard.classList.add("hidden");

        const apiUrl = `https://192.168.1.39:7136/api/deezer/artist/${query}`;
        await fetchData(apiUrl, displayArtist);
    });

    async function fetchData(apiUrl, callback) {
        try {
            searchButton.disabled = true;
            searchButton.textContent = "Chargement...";
            artistList.innerHTML = '<div class="flex justify-center"><div class="loader border-4 border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div></div>';

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
        if (!artist) {
            artistCard.classList.add("hidden");
            artistList.innerHTML = `<p class="text-gray-400">Aucun artiste trouvé.</p>`;
            return;
        }

        // Display artist card
        artistImage.src = artist.pictureMedium || 'default-artist-image-url';
        artistName.textContent = artist.name;
        artistCard.classList.remove("hidden");

        if (!artist.albums.length) {
            artistList.innerHTML = `<p class="text-gray-400">Aucun album trouvé pour cet artiste.</p>`;
            return;
        }
        artistList.innerHTML = artist.albums
            .map(
                (album) => `
                <div id="accordion-${album.id}" class="border border-gray-700 rounded-lg overflow-hidden">
                    <h2 id="heading-${album.id}">
                        <button type="button" class="accordion-button flex items-center justify-between w-full p-5 bg-gray-800 text-white font-medium text-left focus:outline-none" data-accordion-target="#body-${album.id}" aria-expanded="false" aria-controls="body-${album.id}">
                            <span class="flex items-center">
                                <img src="${album.cover || 'default-album-cover-url'}" alt="${album.title}" class="album-cover rounded w-16 h-16 object-cover mr-4" />
                                ${album.title}
                            </span>
                            <svg data-accordion-icon class="w-4 h-4 text-white transform transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </h2>
                    <div id="body-${album.id}" class="hidden accordion-content p-5 bg-gray-700 text-gray-400 transition-max-height max-h-0" aria-labelledby="heading-${album.id}">
                        <ul class="list-disc pl-5">
                            ${album.tracks.map(track => `<li>${track.title}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `
            )
            .join('');

        artist.albums.forEach(album => {
            const button = document.querySelector(`#heading-${album.id} button`);
            const body = document.getElementById(`body-${album.id}`);
            const icon = button.querySelector('svg');
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
                body.classList.toggle('hidden');
                body.style.maxHeight = isExpanded ? '0px' : `${body.scrollHeight}px`;
                icon.classList.toggle('rotate-180');
            });
        });
    }
});
