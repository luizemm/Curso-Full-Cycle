package database_test

import (
	"database/sql"
	"testing"

	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/database"
	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"
	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/timeutils"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type ClientDBTestSuite struct {
	suite.Suite
	db *sql.DB
	clientDB *database.ClientDB
}

func (s *ClientDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)
	s.db = db
	db.Exec("CREATE TABLE clients (id varchar(255) PRIMARY KEY, name varchar(255), email varchar(255), created_at datetime)")
	s.clientDB = database.NewClientDB(db)
}

func (s *ClientDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE clients")
}

func TestClientDBTestSuite(t *testing.T) {
	suite.Run(t, new(ClientDBTestSuite))
}

func (s *ClientDBTestSuite) TestSave() {
	client, _ := entity.NewClient("John", "j@email.com")
	err := s.clientDB.Save(client)
	s.Nil(err)
}

func (s *ClientDBTestSuite) TestGet() {
	client, _ := entity.NewClient("John", "j@email.com")
	s.clientDB.Save(client)

	clientDB, err := s.clientDB.Get(client.ID)
	s.Nil(err)
	s.Equal(client.ID, clientDB.ID)
	s.Equal(client.Name, clientDB.Name)
	s.Equal(client.Email, clientDB.Email)
	s.Equal(client.CreatedAt.Format(timeutils.DefaultTimeFormat), clientDB.CreatedAt.Format(timeutils.DefaultTimeFormat))
}