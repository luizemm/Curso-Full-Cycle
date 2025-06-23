package createclient_test

import (
	"testing"

	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"
	createclient "github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/usecase/create_client"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type ClientGatewayMock struct {
	mock.Mock
}

func (m *ClientGatewayMock) Get(id string) (*entity.Client, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Client), args.Error(1)
}

func (m *ClientGatewayMock) Save(client *entity.Client) error {
	args := m.Called(client)
	return args.Error(0)
}

func TestCreateClientUseCase_Execute(t *testing.T) {
	m := &ClientGatewayMock{}
	m.On("Save", mock.Anything).Return(nil)
	uc := createclient.NewCreateClientUseCase(m)

	output, err := uc.Execute(createclient.CreateClientInputDTO{
		Name:  "John Doe",
		Email: "jd@email.com",
	})
	assert.Nil(t, err)
	assert.NotNil(t, output)
	assert.NotEmpty(t, output.ID)
	assert.Equal(t, "John Doe", output.Name)
	assert.Equal(t, "jd@email.com", output.Email)
	m.AssertExpectations(t)
	m.AssertNumberOfCalls(t, "Save", 1)
}