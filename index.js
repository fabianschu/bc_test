import { createPublicClient, http, formatEther } from 'viem';
import { optimismSepolia } from 'viem/chains';

const abi = [
  {
    type: 'function',
    name: 'calculatePurchaseReturn',
    inputs: [
      {
        name: '_supply',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_connectorBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_connectorWeight',
        type: 'uint32',
        internalType: 'uint32',
      },
      {
        name: '_depositAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
];

const address = '0xe4D50fEA690AB42F183460AC184F2AD1D41E1056';

const client = createPublicClient({
  chain: optimismSepolia,
  transport: http(
    'https://optimism-sepolia.infura.io/v3/c61974fcdc8142b78422f01f74ee1b9c'
  ),
});

const getData = async (args) => {
  const data = await client.readContract({
    abi,
    address,
    functionName: 'calculatePurchaseReturn',
    args,
  });
  return data;
};

export const plotCurve = async (
  startVirtualIssuanceSupply,
  startVirtualCollateralSupply,
  reserveRatio,
  depositAmount
) => {
  let virtualIssuanceSupply = startVirtualIssuanceSupply;
  let virtualCollateralSupply = startVirtualCollateralSupply;

  const data = [
    {
      virtualCollateralSupply: formatEther(
        startVirtualCollateralSupply
      ),
      virtualIssuanceSupply: formatEther(startVirtualIssuanceSupply),
      spotPrice: calcSpotPrice(
        startVirtualIssuanceSupply,
        startVirtualCollateralSupply,
        reserveRatio
      ),
    },
  ];

  for (let i = 1; i < 11; i++) {
    const args = [
      virtualIssuanceSupply,
      virtualCollateralSupply,
      reserveRatio,
      depositAmount,
    ];
    const issuance = await getData(args);
    virtualCollateralSupply += depositAmount;
    virtualIssuanceSupply += issuance;

    const spotPrice = calcSpotPrice(
      virtualIssuanceSupply,
      virtualCollateralSupply,
      reserveRatio
    );

    data.push({
      virtualCollateralSupply: formatEther(virtualCollateralSupply),
      virtualIssuanceSupply: formatEther(virtualIssuanceSupply),
      issuance: formatEther(issuance),
      spotPrice,
      depositedAmount: formatEther(depositAmount),
      relativePriceIncrease:
        (spotPrice - data[i - 1].spotPrice) / data[i - 1].spotPrice,
    });
  }

  return data;
};

export const calcSpotPrice = (
  virtualIssuanceSupply,
  virtualCollateralSupply,
  reserveRatio
) => {
  const ratioPct = parseInt(reserveRatio) / 1_000_000;
  const parsedSupply = parseInt(virtualIssuanceSupply);
  const parsedCollateral = parseInt(virtualCollateralSupply);
  const price = parsedCollateral / (parsedSupply * ratioPct);
  return price;
};
