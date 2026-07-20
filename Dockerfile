# Build stage
FROM golang:1.26-alpine3.24 AS builder
WORKDIR /app
COPY . .
RUN go build -o main main.go
        

# Run Stage
FROM alpine:3.24
WORKDIR /app
COPY --from=builder /app/main .
COPY app.env .
COPY start.sh .
COPY wait-for.sh .
RUN chmod +x start.sh wait-for.sh
COPY db/migration ./db/migration


EXPOSE 8080
CMD [ "/app/main" ]
ENTRYPOINT [ "/app/start.sh", "/app/main" ]