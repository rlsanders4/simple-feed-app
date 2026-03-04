# simple-feed-app
A simple social-media feed to post images and text. A Docker image is provided for the application.

## Using the existing image
```
# Download simple-feed-app.tar image

# Run on Windows
docker run --name simple-feed-app -p 80:80 -v ${PWD}/data:/app/data simple-feed-app

# Run on Linux
docker run --name simple-feed-app -p 80:80 -v $(pwd)/data:/app/data simple-feed-app
```

## Creating a new image
```
# Build
docker build -t simple-feed-app .

# Export
docker save -o simple-feed-app.tar simple-feed-app

# Run on Windows
docker run --name simple-feed-app -p 80:80 -v ${PWD}/data:/app/data simple-feed-app

# Run on Linux
docker run --name simple-feed-app -p 80:80 -v $(pwd)/data:/app/data simple-feed-app
```
