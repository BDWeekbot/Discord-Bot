# Build Stage
FROM golang:1.22.0-alpine AS builder
RUN apk add --no-cache gcc musl-dev ca-certificates fuse3 sqlite bash
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
ENV CGO_ENABLED=1
RUN go build -o /main ./cmd

# Final Stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates fuse3 sqlite
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
COPY --from=builder /main /main
COPY start.sh /start.sh
RUN chmod +x /start.sh
EXPOSE 8080
ENTRYPOINT ["/start.sh"]