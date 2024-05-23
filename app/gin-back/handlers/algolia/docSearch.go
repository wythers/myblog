package algolia

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	snapshots *[]Snapshots = nil
)

func init() {
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
}

func DocSearch(c *gin.Context) {
	syncFetch()
	if snapshots == nil {
		fmt.Println("4")
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.HTML(http.StatusOK, "algoliaIndex.tmpl", gin.H{
		"Snapshots": snapshots,
	})
}

func Rendering(c *gin.Context) {
	l := c.Params.ByName("lang")
	i := c.Params.ByName("idx")

	idx, err := strconv.Atoi(i)

	if err != nil || idx >= len(*snapshots) {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	lang, err := strconv.Atoi(l)
	if err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	langStr := "en"
	if lang == 1 {
		langStr = "zh"
	}

	splited := strings.Split((*snapshots)[idx].Title[lang], " ")
	nameJoined := strings.Join(splited, "-")
	joined := ""
	for _, t := range (*snapshots)[idx].Tags {
		joined = joined + t + "/"

	}

	c.HTML(http.StatusOK, "algoliaPost.tmpl", gin.H{
		"title": (*snapshots)[idx].Title[lang],
		"date":  (*snapshots)[idx].Date,
		"tags":  (*snapshots)[idx].Tags,
		"url":   "/" + langStr + "/docs/" + joined + nameJoined,
	})
}

func Discard(c *gin.Context) {
	c.AbortWithStatus(http.StatusNotFound)
}

func syncFetch() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://appserver/raw/snapshots.json", nil)
	if err != nil {
		fmt.Println("1", err)
		return
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.ContentLength == -1 {
		fmt.Println("2", err)
		return
	}

	b, err := io.ReadAll(resp.Body)
	if err != nil {
		return
	}
	resp.Body.Close()

	s := []Snapshots{}
	err = json.Unmarshal(b, &s)
	if err != nil {
		fmt.Println("3", err)
		return
	}

	for i := range s {
		s[i].Urls = append(s[i].Urls, "/algolia/docs/0/"+strconv.Itoa(i))
		s[i].Urls = append(s[i].Urls, "/algolia/docs/1/"+strconv.Itoa(i))
	}

	snapshots = &s
}
