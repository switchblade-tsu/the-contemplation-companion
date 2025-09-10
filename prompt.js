const promptButton = document.getElementById('get-prompt-button');
const promptInput = document.getElementById('prompt-input');
const promptList = document.getElementById('prompt-list');
const submitPromptButton = document.getElementById('submit-prompt-button');

let results = JSON.parse(localStorage.getItem('results')) || [];

async function getWeatherData(location) {
    const apiKey = "f67e78bccee61801204d4513ae659235";
    const URL = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=' + apiKey + '&units=metric';

    try {
        const response = await fetch(URL);
        const data = await response.json();
        return {
            temperature: data.main.temp,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            location: data.name,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
            dt: data.dt
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

submitPromptButton.addEventListener('click', () => {
  const userPrompt = promptInput.value.trim();
  if (userPrompt) {
    results.push({ text: userPrompt });
    localStorage.setItem('results', JSON.stringify(results));
    renderResults();
    promptInput.value = '';
  }
});

function renderResults(){
  promptList.innerHTML = '';
  results.forEach((result, index) => {
   const listItem = document.createElement('li');
    listItem.textContent = result.text;

    // Create a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.scale = '0.5';
    deleteBtn.addEventListener('click', () => {
      results.splice(index, 1); // Remove the item
      localStorage.setItem('results', JSON.stringify(results));
      renderResults();
    });

    listItem.appendChild(deleteBtn);
    promptList.appendChild(listItem);
  });
}



promptButton.addEventListener('click', async (event) => {
  const location = prompt("Enter your location:");
  if (!location) {
    alert("Location is required to get the weather data.");
    return;
  }
//get weather data
  const weatherData = await getWeatherData(location);
  if (!weatherData) {
    alert("Could not retrieve weather data. Please try again later.");
    return;
  }

// Get sunrise, sunset, and current time (all in seconds)
const sunrise = weatherData.sunrise;
const sunset = weatherData.sunset;
const now = weatherData.dt;

// Determine if it's day or night
let timeOfDay;
if (now >= sunrise && now < sunset) {
    timeOfDay = "day";
} else {
    timeOfDay = "night";
}

// day/night prompts
const prompts = generateWeatherPrompt(timeOfDay);
const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  promptInput.value = randomPrompt;
  
  const listItem = document.createElement('li');
  
  listItem.textContent = randomPrompt;
  promptList.appendChild(listItem);
});
  
















//Generate writing prompts based on weather conditions
function generateWeatherPrompt(weatherType) {
  const prompts = {
    rain: ["Write about a conversation overheard between raindrops hitting your window.","Describe a memory that the sound of rain brings back to you." ,"The rain is washing away a secret. What is it?", "Write a letter to someone you miss, with the rain as your backdrop."],
    clear: ["Write about a perfect day under a clear sky.","Describe the feeling of warmth on your skin during a sunny afternoon.", "Write about the shadows cast by the sun in your surroundings." ,"Describe the perfect day that starts with this weather.", "Imagine the lives happening under the same clear sky across the world right now"],
    clouds: ["If these clouds could talk, what would they say?","Describe the shapes you see in the clouds above you.","Write about a time when the clouds changed your mood.", "Imagine a world where clouds are made of something other than water.", "Write a story about a character who finds a secret in the clouds."],
    snow: ["Describe the sound of snow crunching underfoot.","Write about a childhood memory involving snow.","Imagine a world where it never stops snowing.", "Write about the first snowfall of the year and its impact on you.", "Describe the beauty of a snow-covered landscape at dawn."],
    Thunderstorm: ["Write about the power of a thunderstorm and how it makes you feel.","Describe the smell of rain before a storm hits.","Imagine a character who finds shelter during a thunderstorm and what they discover there.", "Write about the calm before the storm.", "Describe the chaos that ensues during a sudden thunderstorm."],
    default: ["Write about the weather today and how it affects your mood.","Describe a scene where the weather plays a crucial role in the story.","Imagine a character who is deeply affected by the weather around them.", "Write about a time when the weather changed unexpectedly.", "Describe how different cultures interpret and celebrate various weather conditions."],
    night: ["Describe the sounds you hear at night and what they make you think of.","Write about a character who finds inspiration in the quiet of the night.","Imagine a world where night never ends.", "Write about a memorable night under the stars.", "Describe the contrast between the bustling day and the serene night."],
    
    
  }; 


  const selectedPrompts = prompts[weatherType] || prompts.default;
  return selectedPrompts;
}


