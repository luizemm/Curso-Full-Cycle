package entity_test

import (
	"testing"

	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"
	"github.com/stretchr/testify/assert"
)

func TestCreateNewClient(t *testing.T) {
	name := "John Doe"
	email := "jd@email.com"
	
	client, err := entity.NewClient(name, email)

	assert.Nil(t, err)
	assert.NotNil(t, client)
	assert.Equal(t, name, client.Name)
	assert.Equal(t, email, client.Email)
}

func TestCreateNewClientWhenArgsAreInvalid(t *testing.T) {
	client, err := entity.NewClient("", "")

	assert.NotNil(t, err)
	assert.Nil(t, client)
}

func TestUpdateClient(t  *testing.T) {
	client, _ := entity.NewClient("John Doe", "jd@email.com")

	nameUpdated := "John Doe updated"
	emailUpdated := "jd.updated@email.com"

	err := client.Update(nameUpdated, emailUpdated)

	assert.Nil(t, err)
	assert.Equal(t, nameUpdated, client.Name)
	assert.Equal(t, emailUpdated, client.Email)
}

func TestUpdateClientWithInvalidArgs(t *testing.T) {
	client, _ := entity.NewClient("John Doe", "jd@email.com")

	nameUpdated := ""
	emailUpdated := "jd.updated@email.com"

	err := client.Update(nameUpdated, emailUpdated)

	assert.Error(t, err, "name is required")
}

func TestAddAccountToClient(t *testing.T) {
	client, _ := entity.NewClient("John Doe", "jd@email.com")
	account := entity.NewAccount(client)

	err := client.AddAccount(account)
	
	assert.Nil(t, err)
	assert.Equal(t, 1, len(client.Accounts))
}