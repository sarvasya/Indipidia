const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const titleEl = document.getElementById("title");
const extractEl = document.getElementById("extract");
const thumbnailEl = document.getElementById("thumbnail");

// Function to fetch Wikipedia summary
async function searchWikipedia(query) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Not found");
    }
    const data = await response.json();

    // Update DOM
    titleEl.textContent = data.title;
    extractEl.textContent = data.extract;
    if (data.thumbnail && data.thumbnail.source) {
      thumbnailEl.src = data.thumbnail.source;
      thumbnailEl.style.display = "block";
    } else {
      thumbnailEl.style.display = "none";
    }
  } catch (error) {
    titleEl.textContent = "Not Found";
    extractEl.innerHTML = `No article found for "<strong>${query}</strong>". Try another search.`;
    thumbnailEl.style.display = "none";
  }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchWikipedia(query);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      searchWikipedia(query);
    }
  }
});

// Optional: Load a default article on page load (e.g., "Knowledge")
window.addEventListener("load", () => {
  if (!window.location.hash) {
    searchWikipedia("Knowledge");
  }
});
