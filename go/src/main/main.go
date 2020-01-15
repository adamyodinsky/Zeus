package main

import (
	"net/http"

	"github.com/adamyodinsky/Zeus.git/src/controllers"
	"github.com/gorilla/mux"
	logger "github.com/sirupsen/logrus"
)

func main() {
	logger.Info("A walrus appears")

	router := mux.NewRouter()

	router.HandleFunc("/", controllers.GetRoot).Methods("GET")
	logger.Fatal(http.ListenAndServe(":8000", router))
}
