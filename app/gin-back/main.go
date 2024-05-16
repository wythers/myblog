package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"

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
	log.Println("Connect to MongoDB.")
}

func main() {
	nginx := gin.New()

	nginx.Use(
		logger.New(Context.MongoClient()),
		recovery.New(Context.MongoClient()),
	)

	nginx.NoRoute(func(c *gin.Context) {
		c.File("/static/index.html")
	})
	nginx.Static("/imgs", "/static/imgs")
	nginx.Static("/assets", "/static/assets")

	nginx.Run(":8080")
}
