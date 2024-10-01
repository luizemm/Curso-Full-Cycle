package application_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/luizemm/Curso-Full-Cycle/hexagonal/application"
	"github.com/stretchr/testify/require"
)

func TestProduct_Enable(t *testing.T) {
	product := application.Product{}
	product.Name = "Hello"
	product.Status = application.DISABLED
	product.Price = 10

	err := product.Enable()
	require.Nil(t, err)

	product.Price = 0
	err = product.Enable()
	require.EqualError(t, err, "the price must be greater than 0 to enable the product")
}

func TestProduct_Disable(t *testing.T) {
	product := application.Product{}
	product.Name = "Hello"
	product.Status = application.DISABLED
	product.Price = 0

	err := product.Disable()
	require.Nil(t, err)

	product.Price = 10
	err = product.Disable()
	require.EqualError(t, err, "the price must be 0 in order to have the product disabled")
}

func TestProduct_IsValid(t *testing.T) {
	product := application.Product{}

	uuid, _ := uuid.NewRandom()
	product.ID = uuid.String()
	product.Name = "hello"
	product.Status = application.DISABLED
	product.Price = 10

	_, err := product.IsValid()
	require.Nil(t, err)

	product.Status = "INVALID"
	_, err = product.IsValid()
	require.EqualError(t, err, "the status must be enabled or disabled")

	product.Status = application.ENABLED
	_, err = product.IsValid()
	require.Nil(t, err)

	product.Price = -10
	_, err = product.IsValid()
	require.EqualError(t, err, "the price must be greater or equal 0")
}
