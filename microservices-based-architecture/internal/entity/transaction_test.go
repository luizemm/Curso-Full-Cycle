package entity_test

import (
	"testing"

	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"
	"github.com/stretchr/testify/assert"
)

func TestCreateTransaction(t *testing.T) {
	client1, _ := entity.NewClient("John Doe", "jd@email.com")
	account1 := entity.NewAccount(client1)
	client2, _ := entity.NewClient("Jane Doe", "jd@email.com")
	account2 := entity.NewAccount(client2)

	account1.Credit(1000)
	account2.Credit(1000)

	transaction, err := entity.NewTransaction(account1, account2, 100)
	
	assert.Nil(t, err)
	assert.NotNil(t, transaction)
	assert.Equal(t, 900.0, account1.Balance)
	assert.Equal(t, 1100.0, account2.Balance)
}

func TestCreateTransactionWithInsuficientBalance(t *testing.T) {
	client1, _ := entity.NewClient("John Doe", "jd@email.com")
	account1 := entity.NewAccount(client1)
	client2, _ := entity.NewClient("Jane Doe", "jd@email.com")
	account2 := entity.NewAccount(client2)

	account1.Credit(1000)
	account2.Credit(1000)

	transaction, err := entity.NewTransaction(account1, account2, 2000)

	assert.NotNil(t, err)
	assert.Error(t, err, "insufficient funds")
	assert.Nil(t, transaction)
	assert.Equal(t, 1000.0, account1.Balance)
	assert.Equal(t, 1000.0, account2.Balance)
}