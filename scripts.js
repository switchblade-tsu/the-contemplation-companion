const addPoemButton = document.querySelector('.add-poem-btn');

addPoemButton.addEventListener('click', () => {
    async function fetchPoems() {
        try {
            const response = await fetch('https://poetrydb.org/author,title/Shakespeare;Sonnet'); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const poems = await response.json();
            // Pick a random poem
            const randomPoem = poems[Math.floor(Math.random() * poems.length)];
            displayPoems([randomPoem]); // Pass as array for displayPoems
        } catch (error) {
            console.error('Error fetching poems:', error);
        }
    }
    fetchPoems();
});

    
function displayPoems(poems) {
    const poemList = document.querySelector('.poem-items');
    poemList.innerHTML = ''; // Clear existing poems
    
    poemList.style.display = 'block'; // Show the poem list


    poems.forEach(poem => {
        const poemItem = document.createElement('li');
        poemItem.className = 'poem-item';

        const title = document.createElement('div');
        title.className = 'poem-title';
        title.textContent = poem.title;

        const author = document.createElement('div');
        author.className = 'poem-author';
        author.textContent = `by ${poem.author}`;

        const content = document.createElement('div');
        content.className = 'poem-content';
        content.textContent = poem.lines;

        poemItem.appendChild(title);
        poemItem.appendChild(author);
        poemItem.appendChild(content);
        poemList.appendChild(poemItem);
    });
}
