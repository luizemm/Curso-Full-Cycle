package entity

import (
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type Client struct {
	ID string
	Name string
	Email string
	Accounts []*Account
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewClient(name, email string) (*Client, error) {
	client := &Client{
		ID:       uuid.NewString(),
		Name:      name,
		Email:     email,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := client.Validate(); err != nil {
		return nil, err
	}

	return client, nil
}

func (c *Client) Validate() error {
	if c.Name == "" {
		return fmt.Errorf("name is required")
	}
	if c.Email == "" {
		return fmt.Errorf("email is required")
	}
	return nil
}

func (c *Client) Update(name, email string) error {
	c.Name = name
	c.Email = email
	c.UpdatedAt = time.Now()

	if err := c.Validate(); err != nil {
		return err
	}

	return nil
}

func (c *Client) AddAccount(account *Account) error{
	if account.Client.ID != c.ID {
		return errors.New("account does not belong to this client")
	}
	c.Accounts = append(c.Accounts, account)

	return nil
}