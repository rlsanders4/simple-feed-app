const form = document.getElementById('postForm');
const feed = document.getElementById('feed');
const clearBtn = document.getElementById('clearBtn');

const imageInput = document.getElementById('image');
const fileNameDisplay = document.getElementById('fileName');
const fileInfo = document.getElementById('fileInfo');
const removeFileBtn = document.getElementById('removeFile');

const cameraIcon = `
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M4 5h4l2-2h4l2 2h4v14H4zM12 17a4 4 0 100-8 4 4 0 000 8z"/>
</svg>
`;

const checkIcon = `
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/>
</svg>
`;

async function loadPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  feed.innerHTML = '';
  posts.forEach(post => {
    const li = document.createElement('li');
    li.innerHTML = `
        ${post.content ? `<div>${post.content}</div>` : ''}
        ${post.image ? `<img src="${post.image}" />` : ''}
        <small>${new Date(post.createdAt).toLocaleString()}</small>
    `;
    feed.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const content = document.getElementById('content').value.trim();
    const imageFile = document.getElementById('image').files[0];
  
    if (!content && !imageFile) {
      alert("Please add text or select an image.");
      return;
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
  
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (imageFile) formData.append('image', imageFile);
  
    await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });
  
    form.reset();
    fileInfo.classList.add('hidden');
    fileNameDisplay.textContent = '';
    loadPosts();
  });

clearBtn.addEventListener('click', async () => {
  if (!confirm("Are you sure you want to delete all posts?")) return;
  await fetch('/api/posts', { method: 'DELETE' });
  loadPosts();
});

imageInput.addEventListener('change', function () {
    if (this.files.length > 0) {
      fileNameDisplay.textContent = this.files[0].name;
      fileInfo.classList.remove('hidden');
    } else {
      fileInfo.classList.add('hidden');
    }
});

removeFileBtn.addEventListener('click', function () {
    imageInput.value = '';        // Clear file input
    fileNameDisplay.textContent = '';
    fileInfo.classList.add('hidden');
});

// On page load, remove any saved file selection
window.addEventListener('load', () => {
    imageInput.value = '';              // Clear file input
    fileInfo.classList.add('hidden');   // Hide file info
    localStorage.removeItem('selectedFileName'); // Remove saved filename
  });

loadPosts();