package algolia

type Snapshots struct {
	Title []string `json:"title"`
	Date  string   `json:"date"`
	Tags  []string `json:"tags"`

	Urls []string
}
