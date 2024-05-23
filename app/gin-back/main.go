package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"

	"github.com/wythers/myblog/app/gin-back/handlers/algolia"
	"github.com/wythers/myblog/app/gin-back/internal/urls"
	"github.com/wythers/myblog/app/gin-back/middlewares/logger"
	"github.com/wythers/myblog/app/gin-back/middlewares/recovery"
	global "github.com/wythers/myblog/app/gin-back/type"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Context *global.Context
)

func init() {
	mongoOption := options.Client().ApplyURI(urls.Mongodb())
	mongoClient, err := mongo.Connect(context.TODO(), mongoOption)
	if err != nil {
		log.Fatalf("MongoDB: %s", err.Error())
	}

	if err := mongoClient.Ping(context.TODO(), nil); err != nil {
		log.Fatalf("MongoDB: %s", err.Error())
	}

	Context = global.NewContext(mongoClient)
	log.Println("Connected to MongoDB.")
}

func main() {
	nginx := gin.New()

	nginx.Use(
		logger.New(Context.MongoClient()),
		recovery.New(Context.MongoClient()),
	)

	// the loading shell
	{
		nginx.NoRoute(func(c *gin.Context) {
			c.File("/static/index.html")
		})
	}

	// the static resource
	{
		nginx.Static("/imgs", "/static/imgs")
		nginx.Static("/assets", "/static/assets")
	}

	// the algolia docSearch
	{
		nginx.LoadHTMLGlob("/algolia/templates/*")
		nginx.GET("/algolia/docs", algolia.DocSearch)
		nginx.GET("/algolia/docs/:lang/:idx", algolia.Rendering)
		nginx.GET("/sitemap.xml", algolia.Discard)
	}

	nginx.Run(":8080")
}
