package handler

import "encoding/json"

func jsonError(msg string) []byte {
	errorObject := struct {
		Message string `json:"message"`
	}{
		msg,
	}

	r, err := json.Marshal(errorObject)

	if err != nil {
		return []byte(err.Error())
	}

	return r
}
