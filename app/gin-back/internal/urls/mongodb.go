package urls

import (
	"fmt"
	"net/url"
	"os"
	"strings"
)

func Mongodb() string {
	b, err := os.ReadFile("/mongodb/password.conf")
	if err != nil {
		panic("urls/mongodb: " + err.Error())
	}

	u := string(b)
	u = strings.TrimSuffix(u, "\n")
	u = strings.TrimSpace(u)
	return fmt.Sprintf("mongodb://admin:%s@mongodb:27017", url.QueryEscape(u))
}
