package api

import (
	"net/http"
	"os"
	"weekbot-go/internal/services/discord"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Gin(ds *discord.DiscordService) {
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
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.GET("/guilds", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": guilds,
		})
	})
	// Set the trusted proxies
	r.SetTrustedProxies([]string{"127.0.0.1"})

	// Use environment variable for port
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000" // Change to a different port
	}
	r.Run(":" + port) // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
