package entity_test

import (
	"testing"

	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"
	"github.com/stretchr/testify/assert"
)

func TestCreateAccount(t *testing.T) {
	client, _ := entity.NewClient("John Doe", "jd@email.com")
	account := entity.NewAccount(client)

	assert.NotNil(t, account)
	assert.Equal(t, client.ID, account.Client.ID)
}

func TestCreateAccountWithNilClient(t *testing.T) {
	account := entity.NewAccount(nil)

	assert.Nil(t, account)
}

func TestCreditAccount(t *testing.T) {
	client, _ := entity.NewClient("John Doe", "jd@email.com")
	account := entity.NewAccount(client)

	account.Credit(100)
	
	assert.Equal(t, 100.0, account.Balance)
}

func TestDebitAccount(t *testing.T) {
	client, _ := entity.NewClient("John Doe", "jd@email.com")
	account := entity.NewAccount(client)

	account.Credit(100)
	account.Debit(50)

	assert.Equal(t, 50.0, account.Balance)
}