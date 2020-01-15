package controllers

import (
	"fmt"
	"net/http"
)

func printItMan() {
	fmt.Println("Hello World!")
}

func GetRoot(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(response, "Welcome to Zeus!")
}
