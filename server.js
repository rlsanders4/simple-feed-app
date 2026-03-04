const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 80;

// Data paths
const DATA_DIR = path.join(__dirname, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const IMAGES_DIR = path.join(DATA_DIR, 'images');

// Ensure directories exist
[DATA_DIR, IMAGES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static(IMAGES_DIR)); // serve images

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: IMAGES_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

// Read/write posts
function readPosts() {
  try { return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8')); }
  catch { return []; }
}
function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// GET all posts
app.get('/api/posts', (req, res) => {
  res.json(readPosts());
});

// POST new post (text, image, or both)
app.post('/api/posts', upload.single('image'), (req, res) => {
    let content = req.body.content ? req.body.content.trim() : '';
    const hasImage = !!req.file;
  
    // Must have at least text OR image
    if (!content && !hasImage) {
      return res.status(400).json({ error: "Post must contain text or an image" });
    }
  
    const posts = readPosts();
  
    const newPost = {
      id: Date.now(),
      content: content || null,
      createdAt: new Date().toISOString(),
      image: hasImage ? `/images/${req.file.filename}` : null
    };
  
    posts.unshift(newPost);
    writePosts(posts);
  
    res.status(201).json(newPost);
  });

// DELETE all posts (also removes images)
app.delete('/api/posts', (req, res) => {
    const posts = readPosts();
  
    // Delete all images
    posts.forEach(post => {
      if (post.image) {
        const imageFileName = path.basename(post.image);
        const filePath = path.join(IMAGES_DIR, imageFileName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Failed to delete image:', filePath, err);
          }
        }
      }
    });
  
    // Clear posts.json
    writePosts([]);
  
    res.json({ message: "All posts cleared" });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});