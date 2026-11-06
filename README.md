# ExploreHub – Travel Discovery & Trip Planner

## Project Overview
ExploreHub is a responsive travel discovery website that helps users explore different destinations, search for places, filter destinations based on region and activities, save their favorite destinations, and organize a three-day travel itinerary.

## Features
- Responsive design for desktop, tablet and mobile devices.
- Dynamic destination cards loaded from a JSON dataset.
- Search destinations by name or location.
- Filter destinations by region and activity.
- Sort destinations by name and budget category.
- Add and remove destinations from Favorites.
- Create a three-day trip itinerary.
- Prevent duplicate destinations within the same itinerary day.
- Save Favorites and trip plans using localStorage.
- Handle empty results and invalid destination data.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- JSON
- Browser localStorage

## Project Setup
1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Install or enable the Live Server extension.
4. Right-click `index.html` and select **Open with Live Server**.
5. Explore the website in your browser.

Note: Run the project using a local server because JavaScript fetches destination data from `destinations.json`.

## Dataset Source
The project uses a sample JSON dataset containing nine travel destinations. The dataset was prepared for this project and includes destination names, locations, regions, price categories, activities, descriptions and image references.

## Project Limitations
- The project does not use a backend or database.
- Favorites and trip plans are stored in the browser's localStorage.
- Saved data is browser-specific and is not synchronized across devices.
- The trip planner does not provide real-time bookings.
- Destination information is based on sample data.


