const form = document.getElementById('storyForm');
const generateBtn = document.getElementById('generateBtn');
const storyOutput = document.getElementById('storyOutput');

form.addEventListener('submit', function(event) {
  event.preventDefault();
});

generateBtn.addEventListener('click', async function() {
  const dogName = document.getElementById('dogName').value;
  const breed = document.getElementById('breed').value;
  const habit = document.getElementById('habit').value;
  const genre = document.getElementById('genre').value;

  storyOutput.textContent = 'Generating your story...';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dogName, breed, habit, genre })
    });

    const data = await response.json();
    storyOutput.textContent = data.story;
  } catch (error) {
    storyOutput.textContent = 'Something went wrong. Please try again.';
  }
});