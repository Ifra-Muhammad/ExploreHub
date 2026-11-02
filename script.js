
// HTML elements select karna

const destinationContainer = document.getElementById("destinationContainer");
const destinationTemplate = document.getElementById("destinationTemplate");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

// JSON file se destinations load karna

async function loadDestinations() {
    try {
        const response = await fetch("destinations.json");

        if (!response.ok) {
            throw new Error("Unable to load destinations data.");
        }

        const destinations = await response.json();

        displayDestinations(destinations);

    } catch (error) {
        console.error("Error loading destinations:", error);

        destinationContainer.innerHTML =
            "<p>Destinations load nahi ho sakin. Please try again.</p>";
    }
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

    // Total destinations count update karna

    resultCount.textContent =
        `Showing ${destinations.length} destinations`;

    // Empty message hide karna

    noResults.style.display = "none";
}

// Function call karna

loadDestinations();
