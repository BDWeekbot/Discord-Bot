# Use the official Golang image as the base image
FROM golang:1.22.0-alpine

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files

COPY go.mod go.sum ./

RUN ls -la

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
ENV CGO_ENABLED=1
RUN go build -o main ./cmd

# Install necessary packages
RUN apk add --no-cache ca-certificates fuse3 sqlite

# Copy litefs binary from the flyio/litefs image
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs

# Set the entrypoint to litefs mount
ENTRYPOINT ["litefs", "mount"]

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["./main"]