import { it, before, describe } from 'node:test';
import assert from 'assert';
import { plotCurve } from './index.js';

// comes from Rohan
const expected = {
  amountOut: [],
};

describe('issuanceSupply: 12mil, collateralSupply: 6.6mil, rr: 30%, depositAmount: 600k, no decimals', () => {
  const startVirtualIssuanceSupply = 1956421690000000000000000n;
  // const startVirtualIssuanceSupply = 1956421n;
  const startVirtualCollateralSupply = 390979310000000000000000n;
  // const startVirtualCollateralSupply = 390979n;
  const reserveRatio = 199800n;
  const depositAmount = 200000000000000000000000n;
  // const depositAmount = 200000n;

  let actual;

  before(async () => {
    actual = await plotCurve(
      startVirtualIssuanceSupply,
      startVirtualCollateralSupply,
      reserveRatio,
      depositAmount
    );
  });

  it('bla', async () => {
    console.log(actual);
  });
});
