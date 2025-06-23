package gateway

import "github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}