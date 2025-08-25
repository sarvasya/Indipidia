const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const titleEl = document.getElementById("title");
const extractEl = document.getElementById("extract");
const thumbnailEl = document.getElementById("thumbnail");

async function searchWikipedia(query) {
  // Show loading state
  titleEl.textContent = "Searching...";
  extractEl.textContent = "Please wait...";
  thumbnailEl.style.display = "none";

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      titleEl.textContent = "Not Found";
      extractEl.innerHTML = `❌ No article found for "<strong>${query}</strong>. Try a different search."`;
      return;
    }

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.status);
    }

    const data = await response.json();

    // Update title
    titleEl.textContent = data.title;

    // Update extract
    extractEl.textContent = data.extract || "No summary available.";

    // Handle thumbnail
    if (data.thumbnail && data.thumbnail.source) {
      thumbnailEl.src = data.thumbnail.source;
      thumbnailEl.style.display = "block";
    } else {
      thumbnailEl.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching data:", error);  // This will show in console
    titleEl.textContent = "Error";
    extractEl.innerHTML = `⚠️ Could not load article: ${error.message}<br><small>Check the console (F12) for details.</small>`;
  }
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchWikipedia(query);
  } else {
    extractEl.textContent = "Please enter a search term.";
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

// Load a default article on startup
window.addEventListener("load", () => {
  searchWikipedia("Knowledge"); // Change this to "Internet" or "Science" if needed
});
