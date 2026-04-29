// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow { 
    enum Status {Created,Funded,Released, Refunded } 

    address public depositor;
    address public beneficiary;
    address public arbiter;
    uint256 public amount;
    Status public status;


    event Deposited(address indexed depositor, uint256 amount);
    event Released(address indexed beneficiary, uint256 amount);
    event Refunded(address indexed depositor, uint256 amount);

    error InvalidDepositor();
    error NotDepositor();
    error InvalidArbiter();
    error NotArbiter();
    error InvalidBeneficiary();
    error SameAddress();
    error InvalidAmount();
    error InvalidStatus();
    error TransactionFailed();

    constructor(address _depositor, address _beneficiary, address _arbiter) {
        if(_depositor == address(0)) revert InvalidDepositor(); 
        if(_arbiter == address(0)) revert InvalidArbiter();
        if(_beneficiary == address(0)) revert InvalidBeneficiary();

        if(_depositor == _arbiter) revert SameAddress();
        if(_depositor == _beneficiary) revert SameAddress();
        if(_arbiter == _beneficiary) revert SameAddress();
        
        depositor = _depositor;
        beneficiary = _beneficiary; 
        arbiter = _arbiter; 
        status = Status.Created;   
    }

    function deposit() external payable{
        if(msg.sender != depositor) revert NotDepositor();
        if(msg.value == 0) revert InvalidAmount();
        if(status != Status.Created) revert InvalidStatus();

        amount = msg.value;
        status = Status.Funded;

        emit Deposited(msg.sender, msg.value);
    }

    function release() external{
        if(msg.sender != arbiter) revert NotArbiter();
        if (status != Status.Funded) revert InvalidStatus();
        uint256 _amount = amount;
        amount = 0;

        status = Status.Released;
        (bool success,) = beneficiary.call{value: _amount}("");
        if(!success) revert TransactionFailed();

        emit Released(beneficiary, _amount);
    }

    function refund() external{
        if(msg.sender != arbiter) revert NotArbiter();
        if(status != Status.Funded) revert InvalidStatus();
        uint256 _amount = amount;
        amount = 0;

        status = Status.Refunded;
        (bool success,) = depositor.call{value: _amount}("");
        if(!success) revert TransactionFailed();

        emit Refunded(depositor, _amount);
    }
}