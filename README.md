# examples

## Running on docker:

```
docker build -t plugnsearch-example -f Dockerfile .
docker run --rm -v "$(pwd)/results:/results" -v "$(pwd)/logs:/logs" plugnsearch-example:latest # Runs hackernews.js by default
```
