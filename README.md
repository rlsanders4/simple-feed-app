Build:
docker build -t simple-feed-app .

Export:
docker save -o simple-feed-app.tar simple-feed-app

Run (linux):
docker run --name simple-feed-app -p 80:80 -v $(pwd)/data:/app/data simple-feed-app

Run (powershell):
docker run --name simple-feed-app -p 80:80 -v ${PWD}/data:/app/data simple-feed-app