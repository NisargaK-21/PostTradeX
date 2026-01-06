// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SettlementTracker {
    enum Status { PENDING, SETTLED }

    struct Trade {
        uint256 tradeId;
        address buyer;
        address seller;
        Status status;
        uint256 timestamp;
    }

    mapping(uint256 => Trade) public trades;

    event TradeRecorded(
        uint256 tradeId,
        address buyer,
        address seller,
        uint256 timestamp
    );

    event SettlementUpdated(
        uint256 tradeId,
        Status status,
        uint256 timestamp
    );

    function recordTrade(
        uint256 tradeId,
        address buyer,
        address seller
    ) external {
        trades[tradeId] = Trade(
            tradeId,
            buyer,
            seller,
            Status.PENDING,
            block.timestamp
        );

        emit TradeRecorded(tradeId, buyer, seller, block.timestamp);
    }

    function settleTrade(uint256 tradeId) external {
        trades[tradeId].status = Status.SETTLED;
        emit SettlementUpdated(tradeId, Status.SETTLED, block.timestamp);
    }
}
