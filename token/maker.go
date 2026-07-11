package token

import "time"

// Maker is an interface that defines methods for creating and managing tokens.
type Maker interface {
	// CreateToken generates a new token for a given username and duration.
	CreateToken(username string, duration time.Duration) (string, error)

	// VerifyToken checks the validity of a token and returns the associated payload if valid.
	VerifyToken(token string) (*Payload, error)
}
