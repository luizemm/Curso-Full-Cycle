package gateway

import "github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"

type AccountGateway interface {
	Save(account *entity.Account) error
	FindByID(id string) (*entity.Account, error)
}