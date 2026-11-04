
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

// Favorites aur Trip Planner ke HTML elements

const favoritesContainer = document.getElementById("favoritesContainer");
const emptyFavorites = document.getElementById("emptyFavorites");

const day1Container = document.getElementById("day1Container");
const day2Container = document.getElementById("day2Container");
const day3Container = document.getElementById("day3Container");

// Saari destinations store karna

let allDestinations = [];

// Favorites aur trip plan ka data store karna

let favoriteDestinations = [];

let tripPlan = {
    day1: [],
    day2: [],
    day3: []
};

// JSON file se destinations load karna

async function loadDestinations() {
    try {
        const response = await fetch("destinations.json");

        if (!response.ok) {
            throw new Error("Unable to load destinations data.");
        }

        allDestinations = await response.json();

        applyFilters();

    } catch (error) {
        console.error("Error loading destinations:", error);

        destinationContainer.innerHTML =
            "<p>Destinations load nahi ho sakin. Please try again.</p>";
    }
}

// Search, filters aur sorting apply karna

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

    displayDestinations(filteredDestinations);
}

// Destination cards display karna

function displayDestinations(destinations) {

    destinationContainer.innerHTML = "";

    destinations.forEach(function(destination) {

        const card = destinationTemplate.content.cloneNode(true);

        const image = card.querySelector(".card-image");
        const title = card.querySelector(".card-title");
        const location = card.querySelector(".card-location");
        const description = card.querySelector(".card-description");
        const activityTags = card.querySelector(".activity-tags");
        const price = card.querySelector(".card-price");

        const favoriteButton = card.querySelector(".favorite-button");
        const tripDaySelect = card.querySelector(".trip-day-select");
        const addToTripButton = card.querySelector(".add-to-trip-button");

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

        // Favorite button ki current state check karna

        const isFavorite = favoriteDestinations.some(function(item) {
            return item.id === destination.id;
        });

        if (isFavorite) {
            favoriteButton.classList.add("active");
            favoriteButton.textContent = "♥";
            favoriteButton.setAttribute("aria-pressed", "true");
        }

        // Favorite button click event

        favoriteButton.addEventListener("click", function() {
            toggleFavorite(destination);
        });

        // Add to Trip button click event

        addToTripButton.addEventListener("click", function() {

            const selectedDay = tripDaySelect.value;

            addToTrip(destination, selectedDay);
        });

        destinationContainer.appendChild(card);
    });

    // Result count update karna

    resultCount.textContent =
        `Showing ${destinations.length} of ${allDestinations.length} destinations`;

    noResults.hidden = destinations.length > 0;
}

// Favorite add ya remove karna

function toggleFavorite(destination) {

    const existingIndex = favoriteDestinations.findIndex(function(item) {
        return item.id === destination.id;
    });

    if (existingIndex === -1) {

        favoriteDestinations.push(destination);

    } else {

        favoriteDestinations.splice(existingIndex, 1);
    }

    displayFavorites();

    applyFilters();
}

// Favorites list display karna

function displayFavorites() {

    favoritesContainer.innerHTML = "";

    emptyFavorites.hidden = favoriteDestinations.length > 0;

    favoriteDestinations.forEach(function(destination) {

        const item = document.createElement("div");
        item.classList.add("trip-item");

        const title = document.createElement("p");
        title.textContent = destination.name;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";
        removeButton.classList.add("remove-trip-button");

        removeButton.addEventListener("click", function() {

            favoriteDestinations = favoriteDestinations.filter(function(item) {
                return item.id !== destination.id;
            });

            displayFavorites();
            applyFilters();
        });

        item.appendChild(title);
        item.appendChild(removeButton);

        favoritesContainer.appendChild(item);
    });
}

// Destination ko selected trip day mein add karna

function addToTrip(destination, selectedDay) {

    const selectedDayDestinations = tripPlan[selectedDay];

    const alreadyAdded = selectedDayDestinations.some(function(item) {
        return item.id === destination.id;
    });

    if (alreadyAdded) {
        alert("This destination is already added to your trip!");
        return;
    }

    selectedDayDestinations.push(destination);

    displayTripPlan();
}

// Trip Plan display karna

function displayTripPlan() {

    const dayContainers = {
        day1: day1Container,
        day2: day2Container,
        day3: day3Container
    };

    Object.keys(tripPlan).forEach(function(day) {

        const container = dayContainers[day];

        container.innerHTML = "";

        if (tripPlan[day].length === 0) {

            const emptyMessage = document.createElement("p");
            emptyMessage.classList.add("empty-message");
            emptyMessage.textContent = "No destinations added yet.";

            container.appendChild(emptyMessage);
        }

        tripPlan[day].forEach(function(destination) {

            const item = document.createElement("div");
            item.classList.add("trip-item");

            const title = document.createElement("p");
            title.textContent = destination.name;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.type = "button";
            removeButton.classList.add("remove-trip-button");

            removeButton.addEventListener("click", function() {

                tripPlan[day] = tripPlan[day].filter(function(item) {
                    return item.id !== destination.id;
                });

                displayTripPlan();
            });

            item.appendChild(title);
            item.appendChild(removeButton);

            container.appendChild(item);
        });
    });
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
