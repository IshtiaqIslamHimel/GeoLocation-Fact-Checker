require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

// Initialize the map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Marker variable
let marker;

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to fetch interesting fact
async function getFact(country, city) {
  try {
    const prompt = `Give me an interesting, short fact about ${city}, ${country}.`;
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant who gives interesting facts about cities and countries." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });
    const fact = completion.data.choices[0].message.content;
    console.log(`Fact about ${city}, ${country}:`, fact);
    // Update fact in the UI
    document.getElementById('fact').textContent = fact;
  } catch (error) {
    console.error("Error fetching fact:", error);
    document.getElementById('fact').textContent = 'N/A';
  }
}

// Function to update info section
async function updateInfo(lat, lng) {
  try {
    // Reset fact to avoid stale data
    document.getElementById('fact').textContent = 'N/A';

    // Reverse geocode with Nominatim
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const nominatimData = await nominatimRes.json();
    const address = nominatimData.address || {};

    // Update basic info
    document.getElementById('country').textContent = address.country || 'N/A';
    document.getElementById('city').textContent = address.city || address.town || address.village || 'N/A';
    document.getElementById('region').textContent = address.state || address.region || 'N/A';
    document.getElementById('zipcode').textContent = address.postcode || 'N/A';
    document.getElementById('coordinates').textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

    // Fetch country data from Rest Countries
    if (address.country_code) {
      const countryRes = await fetch(
        `https://restcountries.com/v3.1/alpha/${address.country_code.toUpperCase()}`
      );
      const countryData = await countryRes.json();
      const country = countryData[0];

      document.getElementById('population').textContent = country.population
        ? country.population.toLocaleString() : 'N/A';
      document.getElementById('currency').textContent = country.currencies
        ? Object.values(country.currencies)[0].name : 'N/A';
      document.getElementById('timezone').textContent = country.timezones
        ? country.timezones[0] : 'N/A';
      const flagImg = document.getElementById('flag');
      if (country.flags) {
        flagImg.src = country.flags.png;
        flagImg.classList.remove('hidden');
      } else {
        flagImg.classList.add('hidden');
      }
    } else {
      document.getElementById('population').textContent = 'N/A';
      document.getElementById('currency').textContent = 'N/A';
      document.getElementById('timezone').textContent = 'N/A';
      document.getElementById('zipcode').textContent = 'N/A';
      document.getElementById('flag').classList.add('hidden');
    }

    // Fetch and display fact
    const country = address.country || 'N/A';
    const city = address.city || address.town || address.village || 'N/A';
    if (country !== 'N/A' && city !== 'N/A') {
      await getFact(country, city);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to fetch location data. Please try again.');
  }
}

// Map click event
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;

  // Remove existing marker if present
  if (marker) map.removeLayer(marker);

  // Add new marker
  marker = L.marker([lat, lng]).addTo(map);

  // Update info
  await updateInfo(lat, lng);
});

// Search functionality
document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value;
  if (!query) return;

  try {
    const searchRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
    );
    const searchData = await searchRes.json();
    if (searchData.length === 0) {
      alert('Location not found!');
      return;
    }

    const { lat, lon } = searchData[0];
    map.setView([lat, lon], 10);

    // Remove existing marker if present
    if (marker) map.removeLayer(marker);

    // Add new marker
    marker = L.marker([lat, lon]).addTo(map);

    // Update info
    await updateInfo(lat, lon);
  } catch (error) {
    console.error('Error searching:', error);
    alert('Failed to search location. Please try again.');
  }
});