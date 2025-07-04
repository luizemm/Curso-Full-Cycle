package entity

import (
	"time"

	"github.com/google/uuid"
)

type Account struct {
	ID      string
	Client *Client
	Balance float64
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewAccount(client *Client) *Account {
	if client == nil {
		return nil
	}
	return &Account{
		ID:       uuid.NewString(),
		Client:   client,
		Balance: 0,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func (a *Account) Credit(amount float64) {
	a.Balance += amount
	a.UpdatedAt = time.Now()
}

func (a *Account) Debit(amount float64) {
	a.Balance -= amount
	a.UpdatedAt = time.Now()
}