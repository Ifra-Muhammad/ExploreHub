// HTML elements select karna

const destinationContainer = document.getElementById("destinationContainer");
const destinationTemplate = document.getElementById("destinationTemplate");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const activityFilter = document.getElementById("activityFilter");
const sortFilter = document.getElementById("sortFilter");
const resetFilters = document.getElementById("resetFilters");

// Saari destinations store karna

let allDestinations = [];// is empty array me json file ka sara data store huga

// JSON file se destinations load karna

async function loadDestinations() {
    try {
        const response = await fetch("destinations.json");

        if (!response.ok) {
            throw new Error("Unable to load destinations data.");
        }

        allDestinations = await response.json();//response.json() json data ko js code me change kerta he 

        applyFilters();

    } catch (error) {
        console.error("Error loading destinations:", error);

        destinationContainer.innerHTML =
            "<p>Destinations load nahi ho sakin. Please try again.</p>";
    }
}

// Search aur filters apply karna

function applyFilters() {

    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedRegion = regionFilter.value;
    const selectedActivity = activityFilter.value;

    let filteredDestinations = allDestinations.filter(function(destination) {

        const matchesSearch =
            destination.name.toLowerCase().includes(searchValue) ||
            destination.location.toLowerCase().includes(searchValue);

        const matchesRegion =
            selectedRegion === "all" ||
            destination.region === selectedRegion;

        const matchesActivity =
            selectedActivity === "all" ||
            destination.activities.includes(selectedActivity);

        return matchesSearch && matchesRegion && matchesActivity;
    });

    // Sorting apply karna

    if (sortFilter.value === "name") {

        filteredDestinations.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });

    } else if (sortFilter.value === "budget") {

        const priceOrder = {
            budget: 1,
            moderate: 2,
            premium: 3
        };

        filteredDestinations.sort(function(a, b) {
            return priceOrder[a.price] - priceOrder[b.price];
        });
    }

    // Filtered destinations display karna

    displayDestinations(filteredDestinations);
}

// Destination cards display karna

function displayDestinations(destinations) {

    destinationContainer.innerHTML = "";

    destinations.forEach(function(destination) {

        // HTML template ki copy banana

        const card = destinationTemplate.content.cloneNode(true);

        // Card ke elements select karna

        const image = card.querySelector(".card-image");
        const title = card.querySelector(".card-title");
        const location = card.querySelector(".card-location");
        const description = card.querySelector(".card-description");
        const activityTags = card.querySelector(".activity-tags");
        const price = card.querySelector(".card-price");

        // JSON data ko card mein set karna

        image.src = destination.image;
        image.alt = destination.name;

        title.textContent = destination.name;
        location.textContent = destination.location;
        description.textContent = destination.description;
        price.textContent = destination.price;

        // Activity tags display karna

        destination.activities.forEach(function(activity) {

            const tag = document.createElement("span");

            tag.textContent = activity;

            activityTags.appendChild(tag);
        });

        // Card webpage par add karna

        destinationContainer.appendChild(card);
    });

    // Result count update karna

    resultCount.textContent =
        `Showing ${destinations.length} of ${allDestinations.length} destinations`;

    // No results message show ya hide karna

    noResults.hidden = destinations.length > 0;
}

// Search input event

searchInput.addEventListener("input", applyFilters);

// Region filter event

regionFilter.addEventListener("change", applyFilters);

// Activity filter event

activityFilter.addEventListener("change", applyFilters);

// Sorting event

sortFilter.addEventListener("change", applyFilters);

// Reset button event

resetFilters.addEventListener("click", function() {

    searchInput.value = "";
    regionFilter.value = "all";
    activityFilter.value = "all";
    sortFilter.value = "default";

    applyFilters();
});

// Function call karna

loadDestinations();
