package logger

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongoCollection struct {
	logCollection *mongo.Collection
}

func New(mongoClient *mongo.Client) gin.HandlerFunc {
	capped := true
	size := int64(1 << 30)

	db := mongoClient.Database("log")
	db.CreateCollection(context.TODO(), "https", &options.CreateCollectionOptions{
		Capped:      &capped,
		SizeInBytes: &size,
	})

	logHttpsCollection := db.Collection("https")

	return mongoCollection{logHttpsCollection}.HandleFunc
}

func (m mongoCollection) HandleFunc(c *gin.Context) {
	type Ele struct {
		ID primitive.ObjectID `json:"id" bson:"_id"`

		Status   int    `json:"status" bson:"status"`
		RemoteIp string `json:"remoteIp" bson:"remoteIp"`

		Method string `json:"method" bson:"method"`
		Path   string `json:"path" bson:"path"`

		Rawtime   time.Time `json:"rawTime" bson:"rawTime"`
		TimeStamp string    `json:"timeStamp" bson:"timeStamp"`
		Latency   string    `json:"latency" bson:"latency"`

		Message string `json:"message" bson:"message"`
	}

	start := time.Now()
	path := c.Request.URL.Path
	raw := c.Request.URL.RawQuery

	c.Next()

	e := &Ele{
		ID: primitive.NewObjectID(),

		Status:   c.Writer.Status(),
		RemoteIp: c.ClientIP(),

		Method: c.Request.Method,
		Path:   path,

		Rawtime: time.Now(),

		Message: c.Errors.ByType(gin.ErrorTypePrivate).String(),
	}
	e.TimeStamp = e.Rawtime.Format("2006/01/02 - 15:04:05")
	e.Latency = fmt.Sprintf("%v", e.Rawtime.Sub(start))
	if raw != "" {
		e.Path = e.Path + "?" + raw
	}

	_, err := m.logCollection.InsertOne(context.TODO(), e)
	if err != nil {
		log.Printf("Error while logging a new request, MongoDB: [%s]\n", err.Error())
		return
	}
}
