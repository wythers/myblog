package recovery

import (
	"context"
	"io"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongoCollection struct {
	logPanicCollection *mongo.Collection
}

func New(mongoClient *mongo.Client) gin.HandlerFunc {
	capped := true
	size := int64(1 << 20)

	db := mongoClient.Database("log")
	db.CreateCollection(context.TODO(), "panic", &options.CreateCollectionOptions{
		Capped:      &capped,
		SizeInBytes: &size,
	})

	logPanicCollection := db.Collection("panic")

	return gin.RecoveryWithWriter(io.MultiWriter(mongoCollection{logPanicCollection}, gin.DefaultErrorWriter))
}

func (m mongoCollection) Write(b []byte) (int, error) {
	type Ele struct {
		ID primitive.ObjectID `json:"id" bson:"_id"`

		Rawtime   time.Time `json:"rawTime" bson:"rawTime"`
		TimeStamp string    `json:"timeStamp" bson:"timeStamp"`

		Message string `json:"message" bson:"message"`
	}

	_b := b[len("\n\n\x1b[31m"):]
	e := &Ele{
		ID: primitive.NewObjectID(),

		Rawtime:   time.Now(),
		TimeStamp: time.Now().Format("2006/01/02 - 15:04:05"),

		Message: string(_b),
	}

	_, err := m.logPanicCollection.InsertOne(context.TODO(), e)

	return len(_b), err
}
