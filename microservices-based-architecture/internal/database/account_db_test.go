package database_test

import (
	"database/sql"
	"testing"

	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/database"
	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"
	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/timeutils"
	"github.com/stretchr/testify/suite"
)

type AccountDBTestSuite struct {
	suite.Suite
	db *sql.DB
	accountDB *database.AccountDB
	client *entity.Client
}

func (s *AccountDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)
	s.db = db
	db.Exec("CREATE TABLE clients (id varchar(255), name varchar(255), email varchar(255), created_at date)")
	db.Exec("CREATE TABLE accounts (id varchar(255), client_id varchar(255), balance int, created_at date)")
	s.accountDB = database.NewAccountDB(db)
	s.client, _ = entity.NewClient("John Doe", "john.doe@example.com")
}

func (s *AccountDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE clients")
	s.db.Exec("DROP TABLE accounts")
}

func TestAccountDBTestSuite(t *testing.T) {
	suite.Run(t, new(AccountDBTestSuite))
}

func (s *AccountDBTestSuite) TestSave() {
	account := entity.NewAccount(s.client)
	err := s.accountDB.Save(account)
	s.Nil(err)
}

func (s *AccountDBTestSuite) TestFindByID() {
	s.db.Exec(
		"INSERT INTO clients (id, name, email, created_at) VALUES (?, ?, ?, ?)",
		s.client.ID, s.client.Name, s.client.Email, s.client.CreatedAt,
	)
	account := entity.NewAccount(s.client)
	err := s.accountDB.Save(account)
	s.Nil(err)

	accountDB, err := s.accountDB.FindByID(account.ID)
	s.Nil(err)
	s.Equal(account.ID, accountDB.ID)
	s.Equal(account.Balance, accountDB.Balance)
	s.Equal(account.CreatedAt.Format(timeutils.DefaultTimeFormat), accountDB.CreatedAt.Format(timeutils.DefaultTimeFormat))
	s.Equal(account.Client.ID, accountDB.Client.ID)
	s.Equal(account.Client.Name, accountDB.Client.Name)
	s.Equal(account.Client.Email, accountDB.Client.Email)
}