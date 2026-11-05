
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

// Favorites aur Trip Plan ka data store karna

let favoriteDestinations = [];

let tripPlan = {
    day1: [],
    day2: [],
    day3: []
};

// localStorage se saved data load karna

function loadSavedData() {

    try {
        const savedFavorites = localStorage.getItem("exploreHubFavorites");

        if (savedFavorites !== null) {
            const parsedFavorites = JSON.parse(savedFavorites);

            if (Array.isArray(parsedFavorites)) {
                favoriteDestinations = parsedFavorites;
            }
        }
    } catch (error) {
        console.error("Error loading favorites:", error);
        favoriteDestinations = [];
    }

    try {
        const savedTripPlan = localStorage.getItem("exploreHubTripPlan");

        if (savedTripPlan !== null) {
            const parsedTripPlan = JSON.parse(savedTripPlan);

            if (parsedTripPlan && typeof parsedTripPlan === "object") {

                tripPlan.day1 = Array.isArray(parsedTripPlan.day1)
                    ? parsedTripPlan.day1 : [];

                tripPlan.day2 = Array.isArray(parsedTripPlan.day2)
                    ? parsedTripPlan.day2 : [];

                tripPlan.day3 = Array.isArray(parsedTripPlan.day3)
                    ? parsedTripPlan.day3 : [];
            }
        }
    } catch (error) {
        console.error("Error loading trip plan:", error);

        tripPlan = {
            day1: [],
            day2: [],
            day3: []
        };
    }
}

// localStorage mein Favorites save karna

function saveFavorites() {

    try {
        localStorage.setItem(
            "exploreHubFavorites",
            JSON.stringify(favoriteDestinations)
        );
    } catch (error) {
        console.error("Unable to save favorites:", error);
    }
}

// localStorage mein Trip Plan save karna

function saveTripPlan() {

    try {
        localStorage.setItem(
            "exploreHubTripPlan",
            JSON.stringify(tripPlan)
        );
    } catch (error) {
        console.error("Unable to save trip plan:", error);
    }
}

// Destination data check karna

function isValidDestination(destination) {

    return (
        destination &&
        typeof destination === "object" &&
        (typeof destination.id === "string" ||
            typeof destination.id === "number") &&
        String(destination.id).trim() !== "" &&
        typeof destination.name === "string" &&
        destination.name.trim() !== "" &&
        typeof destination.location === "string" &&
        destination.location.trim() !== "" &&
        typeof destination.region === "string" &&
        typeof destination.price === "string" &&
        Array.isArray(destination.activities) &&
        destination.activities.every(function(activity) {
            return typeof activity === "string";
        })
    );
}

// Saved data ko current destinations ke saath match karna

function cleanSavedData() {

    const validDestinations = new Map();

    allDestinations.forEach(function(destination) {
        validDestinations.set(String(destination.id), destination);
    });

    function cleanList(savedList) {

        const cleanedList = [];
        const usedIds = new Set();

        savedList.forEach(function(item) {

            if (!item || item.id === undefined || item.id === null) {
                return;
            }

            const id = String(item.id);
            const currentDestination = validDestinations.get(id);

            if (currentDestination && !usedIds.has(id)) {
                cleanedList.push(currentDestination);
                usedIds.add(id);
            }
        });

        return cleanedList;
    }

    favoriteDestinations = cleanList(favoriteDestinations);

    tripPlan.day1 = cleanList(tripPlan.day1);
    tripPlan.day2 = cleanList(tripPlan.day2);
    tripPlan.day3 = cleanList(tripPlan.day3);

    saveFavorites();
    saveTripPlan();
}

// JSON file se destinations load karna

async function loadDestinations() {

    try {
        const response = await fetch("destinations.json");

        if (!response.ok) {
            throw new Error("Unable to load destinations data.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid destinations data format.");
        }

        const usedIds = new Set();

        allDestinations = data.filter(function(destination) {

            if (!isValidDestination(destination)) {
                return false;
            }

            const id = String(destination.id);

            if (usedIds.has(id)) {
                return false;
            }

            usedIds.add(id);
            return true;

        }).map(function(destination) {

            return {
                ...destination,
                description: typeof destination.description === "string"
                    ? destination.description
                    : "No description available.",

                image: typeof destination.image === "string"
                    ? destination.image
                    : ""
            };
        });

        // Saved data ko current JSON ke saath match karna

        cleanSavedData();

        // Favorites aur Trip Plan display karna

        displayFavorites();
        displayTripPlan();

        applyFilters();

    } catch (error) {

        console.error("Error loading destinations:", error);

        destinationContainer.innerHTML =
            "<p>Destinations load nahi ho sakin. Please try again.</p>";

        resultCount.textContent = "Unable to load destinations.";
        noResults.hidden = true;
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

        if (destination.image) {
            image.src = destination.image;
        } else {
            image.removeAttribute("src");
        }

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
            favoriteButton.setAttribute("aria-label", "Remove from favorites");
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

    // No results message show ya hide karna

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

    saveFavorites();

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

            saveFavorites();

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

    if (!tripPlan[selectedDay]) {
        return;
    }

    const selectedDayDestinations = tripPlan[selectedDay];

    const alreadyAdded = selectedDayDestinations.some(function(item) {
        return item.id === destination.id;
    });

    if (alreadyAdded) {
        alert("This destination is already added to your trip!");
        return;
    }

    selectedDayDestinations.push(destination);

    saveTripPlan();

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

                saveTripPlan();

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

// Saved data load karna

loadSavedData();

// Function call karna

loadDestinations();
