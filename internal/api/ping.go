package api

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"weekbot-go/internal/services/discord"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Gin(ds *discord.DiscordService) {
	mode := os.Getenv("GIN_MODE")
	if mode == "" {
		mode = gin.DebugMode
	}
	gin.SetMode(mode)

	guilds := make(map[string]string)
	for _, guild := range ds.GetGuilds() {
		guilds[guild.Name] = guild.ID
	}

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	r.GET("/ping", func(c *gin.Context) {
		println("ping request")
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.GET("/guilds", func(c *gin.Context) {
		println("guild request")
		c.JSON(http.StatusOK, gin.H{
			"message": guilds,
		})
	})

	// Set the trusted proxies
	r.SetTrustedProxies([]string{"127.0.0.1"})

	// Use environment variable for port
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000" // Change to the expected port
	}

	// Create a server
	srv := &http.Server{
		Addr:    "0.0.0.0:" + port, // Ensure the server listens on 0.0.0.0
		Handler: r,
	}

	// Start the server in a goroutine
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// Create a context with timeout for the shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}
