# Interactive Map with Location Facts

This is a web application that displays an interactive map using [Leaflet](https://leafletjs.com/). Users can click on the map or search for a location to view details such as country, city, population, currency, timezone, and an interesting fact about the location. The application integrates multiple APIs:

- **Nominatim** for reverse geocoding (converting coordinates to addresses).
- **Rest Countries** for country-specific data (e.g., population, currency).
- **OpenAI API** for generating interesting facts about cities and countries.

## Features

- **Interactive Map**: Click anywhere on the map to place a marker and retrieve location details.
- **Search Functionality**: Enter a location name to center the map and display details.
- **Location Details**: Displays country, city, region, population, currency, timezone, zipcode, coordinates, and a country flag.
- **Interesting Facts**: Fetches a unique fact about the selected city and country using the OpenAI API.
- **Responsive Design**: Grid-based layout for location details, adapting to mobile and desktop screens.

## Prerequisites

- **Node.js**: Install from [nodejs.org](https://nodejs.org/) to manage dependencies.
- **OpenAI API Key**: Sign up at [OpenAI](https://platform.openai.com/) to obtain an API key for fetching facts.
- **Local Server**: Use a tool like `http-server` or `live-server` to run the application locally.
- **Browser**: A modern web browser (e.g., Chrome, Firefox) for viewing the application.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/IshtiaqIslamHimel/GeoLocation-Fact-Checker.git
   cd GeoLocation-Fact-Checker
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   This installs required packages: `openai` (for fact generation) and `dotenv` (for API key management).

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```
   Replace `your_openai_api_key` with your actual OpenAI API key.

4. **Install a Local Server** (if not already installed):
   ```bash
   npm install -g http-server
   ```

## Usage

1. **Run the Application**:
   Start a local server:
   ```bash
   npx http-server
   ```
   Open your browser and navigate to `http://localhost:8080`.

2. **Interact with the Map**:
   - **Click on the Map**: Click any point to place a marker and view location details and a fact in the info section.
   - **Search for a Location**: Enter a city or place name in the search bar (e.g., "Paris") and click the search button to center the map and display details.

3. **View Location Details**:
   - The info section below the map displays details like country, city, population, currency, timezone, and an interesting fact.
   - Facts are fetched dynamically using the OpenAI API when a valid city and country are identified.

## Project Structure

- `index.html`: Main HTML file with the map, search bar, and info section.
- `styles.css`: Styles for the map, info section, and responsive grid layout.
- `script.js`: JavaScript logic for map interaction, API calls, and fact generation.
- `.env`: Stores the OpenAI API key (not tracked in Git).
- `package.json`: Lists project dependencies and scripts.

## Notes

- **OpenAI API Key**: Ensure your OpenAI API key is valid and has access to the `gpt-4o` model. Usage may incur costs; check [OpenAI’s pricing](https://openai.com/pricing).
- **Browser Compatibility**: The application uses `require` for Node.js modules, which requires bundling for browser use (e.g., with Webpack or Parcel). For production, consider setting up a server-side endpoint for OpenAI API calls to secure the API key.
- **Alternative A4F Integration**: If you prefer to use the A4F API (as in the original code snippet), install `axios` (`npm install axios`) and modify `script.js` to make direct API calls to `https://api.a4f.co/v1/chat/completions` with an A4F API key. Contact A4F support for SDK availability.
- **API Limitations**: Nominatim and Rest Countries APIs are free but have rate limits. Ensure compliance with their usage policies.

## Troubleshooting

- **Fact Not Displaying**: Verify your OpenAI API key in `.env` and ensure the `gpt-4o` model is available in your account.
- **Map Not Loading**: Check your internet connection, as Leaflet relies on OpenStreetMap tiles.
- **CORS Errors**: If API calls fail, ensure you’re running the app via a local server (`http-server`) rather than directly opening `index.html`.
- **Multiple Facts Accumulating**: Modify `script.js` to clear previous facts or use a fixed `<span id="fact">` in `index.html` (see below).



- [Leaflet](https://leafletjs.com/) for the interactive map.
- [Nominatim](https://nominatim.openstreetmap.org/) for geocoding.
- [Rest Countries](https://restcountries.com/) for country data.
- [OpenAI](https://openai.com/) for fact generation.
