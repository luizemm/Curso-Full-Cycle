package database_test

import (
	"database/sql"
	"testing"

	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/database"
	"github.com/luizemm/Curso-Full-Cycle/microservices-based-architecture/internal/entity"
	"github.com/stretchr/testify/suite"
)

type TransactionDBTestSuite struct {
	suite.Suite
	db *sql.DB
	client *entity.Client
	client2 *entity.Client
	accountFrom *entity.Account
	accountTo *entity.Account
	transactionDB *database.TransactionDB
}

func (s *TransactionDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)
	s.db = db
	db.Exec("CREATE TABLE clients (id varchar(255), name varchar(255), email varchar(255), created_at date)")
	db.Exec("CREATE TABLE accounts (id varchar(255), client_id varchar(255), balance int, created_at date)")
	db.Exec("CREATE TABLE transactions (id varchar(255), account_id_from varchar(255), account_id_to varchar(255), amount int, created_at date)")
	s.transactionDB = database.NewTransactionDB(db)
	s.client, err = entity.NewClient("John Doe", "john.doe@example.com")
	s.Nil(err)
	s.client2, err = entity.NewClient("John Doe 2", "john.doe2@example.com")
	s.Nil(err)
	s.accountFrom = entity.NewAccount(s.client)
	s.accountFrom.Balance = 1000
	s.accountTo = entity.NewAccount(s.client2)
	s.accountTo.Balance = 1000
}

func (s *TransactionDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE clients")
	s.db.Exec("DROP TABLE accounts")
	s.db.Exec("DROP TABLE transactions")
}

func TestTransactionDBTestSuite(t *testing.T) {
	suite.Run(t, new(TransactionDBTestSuite))
}

func (s *TransactionDBTestSuite) TestCreate() {
	transaction, err := entity.NewTransaction(s.accountFrom, s.accountTo, 100)
	s.Nil(err)
	err = s.transactionDB.Create(transaction)
	s.Nil(err)
}