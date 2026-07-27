package api

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	db "github.com/rajuputra/simplebank/db/sqlc"
	"github.com/rajuputra/simplebank/token"
)

type depositRequest struct {
	AccountID int64 `json:"account_id" binding:"required,min=1"`
	Amount    int64 `json:"amount" binding:"required,gt=0"`
}

func (server *Server) createDeposit(ctx *gin.Context) {
	var req depositRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Verify account belongs to the user
	account, err := server.store.GetAccount(ctx, req.AccountID)
	if err != nil {
		if errors.Is(err, db.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)
	if account.Owner != authPayload.Username {
		err := errors.New("account doesn't belong to the authenticated user")
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	arg := db.DepositTxParams{
		AccountID: req.AccountID,
		Amount:    req.Amount,
	}

	result, err := server.store.DepositTx(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, result)
}
