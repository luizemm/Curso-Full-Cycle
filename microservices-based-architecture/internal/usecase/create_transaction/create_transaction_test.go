package createtransaction_test

import (
	"testing"

	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"
	createtransaction "github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/usecase/create_transaction"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type TransactionGatewayMock struct {
	mock.Mock
}

func (m *TransactionGatewayMock) Create(transaction *entity.Transaction) error {
	args := m.Called(transaction)
	return args.Error(0)
}

type AccountGatewayMock struct {
	mock.Mock
}

func (m *AccountGatewayMock) Save(account *entity.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *AccountGatewayMock) FindByID(id string) (*entity.Account, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Account), args.Error(1)
}

func TestCreateTransactionUseCase_Execute(t *testing.T) {
	client1, _ := entity.NewClient("Client 1", "client1@email.com")
	account1 := entity.NewAccount(client1)
	account1.Credit(1000)

	client2, _ := entity.NewClient("Client 2", "client2@email.com")
	account2 := entity.NewAccount(client2)
	account2.Credit(1000)

	mockAccount := &AccountGatewayMock{}
	mockAccount.On("FindByID", account1.ID).Return(account1, nil)
	mockAccount.On("FindByID", account2.ID).Return(account2, nil)

	mockTransaction := &TransactionGatewayMock{}
	mockTransaction.On("Create", mock.Anything).Return(nil)

	input := createtransaction.CreateTransactionInputDTO{
		AccountIDFrom: account1.ID,
		AccountIDTo:   account2.ID,
		Amount:        100,
	}

	uc := createtransaction.NewCreateTransactionUseCase(mockTransaction, mockAccount)
	output, err := uc.Execute(input)

	assert.Nil(t, err)
	assert.NotNil(t, output)
	mockAccount.AssertExpectations(t)
	mockAccount.AssertNumberOfCalls(t, "FindByID", 2)
	mockTransaction.AssertExpectations(t)
	mockTransaction.AssertNumberOfCalls(t, "Create", 1)
}