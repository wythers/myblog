package global

import "go.mongodb.org/mongo-driver/mongo"

type Context struct {
	mongoClient *mongo.Client
}

func NewContext(mongoClient *mongo.Client) *Context {
	return &Context{
		mongoClient,
	}
}

func (g Context) MongoClient() *mongo.Client {
	return g.mongoClient
}
