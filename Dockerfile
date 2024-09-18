# Use the official Golang image as the base image
FROM golang:1.22.0-alpine

RUN apk add --no-cache gcc musl-dev ca-certificates fuse3 sqlite bash

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
ENV CGO_ENABLED=1
RUN go build -o main ./cmd

# Copy litefs binary from the flyio/litefs image
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs

# Add a start script to launch both LiteFS and the app
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 3000 to the outside world
EXPOSE 3000

# Run the start script
ENTRYPOINT ["/start.sh"]