package gateway

import "github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"

type ClientGateway interface {
	Get(id string) (*entity.Client, error)
	Save(client *entity.Client) error
}