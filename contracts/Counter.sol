// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
  // 声明一个x的变量，x存储在storage变量中初始值为0
  uint public x;
  // 定义了一个事件，参数 by；事件不会占用合约storage，是写入交易日志log，方便链下索引/监听
  event Increment(uint by);

  // 非view 非pure的函数 会修改合约状态
  // 任何外部账户或合约都可以调用
  function inc() public {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}
