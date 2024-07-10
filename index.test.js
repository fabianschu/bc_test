import { it, before, describe } from 'node:test';
import assert from 'assert';
import { plotCurve } from './index.js';

// comes from Rohan
const expected = {
  amountOut: [],
};

describe('issuanceSupply: 12mil, collateralSupply: 6.6mil, rr: 30%, depositAmount: 600k, no decimals', () => {
  const startVirtualIssuanceSupply = 120000000n;
  const startVirtualCollateralSupply = 65120000n;
  const reserveRatio = 300000n;
  const depositAmount = 6000000000000000000000000n;

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
