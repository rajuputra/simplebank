package db

import "context"

type DepositTxParams struct {
	AccountID int64 `json:"account_id"`
	Amount    int64 `json:"amount"`
}

type DepositTxResult struct {
	Account Account `json:"account"`
	Entry   Entry   `json:"entry"`
}

// DepositTx performs a money deposit into an account.
// It creates a deposit entry and updates the account balance within a single database transaction.
func (store *SQLStore) DepositTx(ctx context.Context, arg DepositTxParams) (DepositTxResult, error) {
	var result DepositTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		var err error

		result.Entry, err = q.CreateEntry(ctx, CreateEntryParams{
			AccountID: arg.AccountID,
			Amount:    arg.Amount,
		})
		if err != nil {
			return err
		}

		result.Account, err = q.AddAccountBalance(ctx, AddAccountBalanceParams{
			ID:     arg.AccountID,
			Amount: arg.Amount,
		})
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}
