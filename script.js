document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript est prêt!");
  
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const artistList = document.getElementById("artistList");
  
    searchButton.addEventListener("click", async function () {
      const query = searchInput.value.trim();
      if (!query) {
        return;
      }
  
      const apiUrl = `https://192.168.1.39:7136/api/deezer/artist/${query}`;
      console.log("apiUrl:" + apiUrl);
  
      try {
        searchButton.disabled = true;
        artistList.innerHTML = '<p>Loading...</p>';
  
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Error getting artist");
        }
        const data = await response.json();
        displayArtist(data);
        console.log(data);
      } catch (error) {
        console.error(error);
        artistList.innerHTML = '<p class="text-red-500">Error fetching artist</p>';
      } finally {
        searchButton.disabled = false;
      }
    });
  
    function displayArtist(artist) {
      artistList.innerHTML = "";
      const artistDiv = document.createElement("div");
      artistDiv.classList.add(
        "p-4",
        "border",
        "border-gray-300",
        "rounded",
        "mb-4"
      );
  
      const artistImage = artist.pictureMedium || 'default-image-url'; 
      artistDiv.innerHTML = `
        <h3 class="text-xl font-bold">${artist.name}</h3>
        <img src="${artistImage}" alt="${artist.name}" class="rounded w-32 h-32 object-cover" />
        <h4 class="text-lg font-semibold mt-4">Albums:</h4>
        <ul id="albumList" class="list-disc pl-5"></ul>
      `;
  
      artistList.appendChild(artistDiv);
  
      const albumList = artistDiv.querySelector("#albumList");
      artist.albums.forEach(album => {
        const albumItem = document.createElement("li");
        albumItem.classList.add("mb-2");
  
        const albumCover = album.cover || 'default-album-cover-url';
        albumItem.innerHTML = `
          <div class="flex items-center">
            <img src="${albumCover}" alt="${album.title}" class="rounded w-16 h-16 object-cover mr-4" />
            <span>${album.title}</span>
          </div>
        `;
  
        albumList.appendChild(albumItem);
      });
    }
  });
  