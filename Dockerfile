
FROM golang:1.22.0-alpine

RUN apk add --no-cache gcc musl-dev

WORKDIR /app



COPY go.mod go.sum ./

RUN ls -la


RUN go mod download


COPY . .


ENV CGO_ENABLED=1
RUN go build -o main ./cmd


RUN apk add --no-cache ca-certificates fuse3 sqlite


COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs


EXPOSE 3000

CMD ["litefs", "mount"]
