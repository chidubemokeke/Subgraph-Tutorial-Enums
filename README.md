# Using Enums for Your Subgraphs

This repository demonstrates the effectiveness of enums by exploring the CryptoCoven NFT smart contract. It showcases how you can extract detailed information from transactions and marketplace interactions, helping you manage data more effectively within your subgraph.

## Objectives

- Make your code cleaner and less error-prone by using enums.
- Understand how enums help categorize NFT marketplaces efficiently.
- See how enums improve clarity and maintainability in your subgraph schema and queries.

## Why Use Enums?

Enums play a critical role in categorizing and managing data in your subgraphs. They define a set of named values that represent specific states or categories, enhancing the structure and clarity of your subgraph.

## Benefits of Enums

- Clarity: Enums provide meaningful names for values, making the data easier to understand.
- Validation: Enums enforce strict value definitions, preventing invalid data entries.
- Maintainability: When you need to change or add new categories, enums allow you to do this centrally.

## Defining Enums

In this repository, we define enums for the various marketplaces where NFTs are traded. Here’s how you can define enums in your subgraph schema:

```gql
# Enum for Marketplaces that the CryptoCoven contract interacted with(likely a Trade/Mint)
enum Marketplace {
  OpenSeaV1 # Represents when a CryptoCoven NFT is traded on the marketplace
  OpenSeaV2 # Represents when a CryptoCoven NFT is traded on the OpenSeaV2 marketplace
  SeaPort # Represents when a CryptoCoven NFT is traded on the SeaPort marketplace
  LooksRare # Represents when a CryptoCoven NFT is traded on the LookRare marketplace
  OxProtocol # Represents when a CryptoCoven NFT is traded on the OxProtocol marketplace
  OxProtocolV2 # Represents when a CryptoCoven NFT is traded on the OxProtocol marketplace
  Blur # Represents when a CryptoCoven NFT is traded on the Blur marketplace
  Rarible # Represents when a CryptoCoven NFT is traded on the Rarible marketplace
  X2Y2 # Represents when a CryptoCoven NFT is traded on the X2Y2 marketplace
  NFTX # Represents when a CryptoCoven NFT is traded on the NFTX marketplace
  GenieSwap # Represents when a CryptoCoven NFT is traded on the NFTX marketplace
  CryptoCoven # Represents when a CryptoCoven NFT is transferred from the crypto coven contract.
  Unknown # Represents when a CryptoCoven NFT is transferred from an unknown marketplace likely not a sale event
}
```

## Utilizing Enums

Once defined, enums can be used throughout your subgraph to categorize transactions or events. For example, when logging NFT sales, you can specify the marketplace involved in the trade using the enum.

## Example Function

Here's how you can implement a function to retrieve the marketplace name from the enum as a string:

```ts
export function getMarketplaceName(marketplace: Marketplace): string {
  // Using if-else statements to map the enum value to a string
  if (marketplace === Marketplace.OpenSeaV1) {
    return "OpenSeaV1"; // If the marketplace is OpenSea, return its string representation
  } else if (marketplace === Marketplace.OpenSeaV2) {
    return "OpenSeaV2";
  } else if (marketplace === Marketplace.SeaPort) {
    return "SeaPort"; // If the marketplace is SeaPort, return its string representation
  } else if (marketplace === Marketplace.LooksRare) {
    return "LooksRare"; // If the marketplace is LooksRare, return its string representation
  } else if (marketplace === Marketplace.OxProtocol) {
    return "OxProtocol"; // If the marketplace is OxProtocol, return its string representation
  } else if (marketplace === Marketplace.OxProtocolV2) {
    return "OxProtocolV2"; // If the marketplace is OxProtocolV2, return its string representation
  } else if (marketplace === Marketplace.Blur) {
    return "Blur"; // If the marketplace is Blur, return its string representation
  } else if (marketplace === Marketplace.Rarible) {
    return "Rarible"; // If the marketplace is Rarible, return its string representation
  } else if (marketplace === Marketplace.X2Y2) {
    return "X2Y2"; // If the marketplace is X2Y2, return its string representation
  } else if (marketplace === Marketplace.NFTX) {
    return "NFTX"; // If the marketplace is NFTX, return its string representation
  } else if (marketplace === Marketplace.GenieSwap) {
    return "GenieSwap"; // If the marketplace is GenieSwap, return its string representation
  } else if (marketplace === Marketplace.CryptoCoven) {
    return "CryptoCoven"; // If the marketplace is CryptoCoven, return its string representation
  } else {
    return "Unknown"; // If the marketplace doesn't match any known values, return "Unknown"
  }
}
```

## Best Practices for Using Enums

- Consistent Naming: Use clear and descriptive names for enum values to enhance readability.
- Centralized Management: Maintain enums in a single file for consistency. This makes enums easier to update and ensures they remain the single source of truth.
- Documentation: Comment on enums to clarify their purpose and usage.

## Testing & Sample Queries

## Enums in Queries

Enums in queries improve data quality and make the results easier to interpret. They serve as both filters and response elements, ensuring consistency and reducing errors in marketplace values.

- Filtering with Enums: They provide clear filters, allowing us to include or exclude specific marketplaces confidently.
- Enums in Responses: They guarantee that only recognized marketplace names are returned, making the results standardized and trustworthy.

## Query 1: Account With The Highest NFT Marketplace Interactions

Query 1: Account With The Highest NFT Marketplace Interactions

This query finds the account with the highest unique NFT marketplace interactions—perfect for analyzing cross-marketplace activity. The marketplaces field uses the Marketplace enum, ensuring consistent and validated marketplace values in the response.

```gql
{
  accounts(first: 1, orderBy: uniqueMarketplacesCount, orderDirection: desc) {
    id
    sendCount
    receiveCount
    totalSpent
    uniqueMarketplacesCount
    marketplaces {
      marketplace # This field returns the enum value representing the marketplace
    }
  }
}
```

## Returns

This response provides account details and a list of unique marketplace interactions with enum values for standardized clarity:

```gql
{
  "data": {
    "accounts": [
      {
        "id": "0xb3abc96cb9a61576c03c955d75b703a890a14aa0",
        "sendCount": "44",
        "receiveCount": "44",
        "totalSpent": "1197500000000000000",
        "uniqueMarketplacesCount": "7",
        "marketplaces": [
          {
            "marketplace": "OpenSeaV1"
          },
          {
            "marketplace": "OpenSeaV2"
          },
          {
            "marketplace": "GenieSwap"
          },
          {
            "marketplace": "CryptoCoven"
          },
          {
            "marketplace": "Unknown"
          },
          {
            "marketplace": "LooksRare"
          },
          {
            "marketplace": "NFTX"
          }
        ]
      }
    ]
  }
}
```

## Query 2: Most Active Marketplace for CryptoCoven Transactions

This query identifies the marketplace with the highest volume of CryptoCoven transactions. It uses the Marketplace enum to ensure only valid marketplace types appear in the response, adding reliability and consistency to your data.

```gql
{
  marketplaceInteractions(
    first: 1
    orderBy: transactionCount
    orderDirection: desc
  ) {
    marketplace
    transactionCount
  }
}
```

## Result 2

The expected response includes the marketplace and the corresponding transaction count, using the enum to indicate the marketplace type:

```gql
{
  "data": {
    "marketplaceInteractions": [
      {
        "marketplace": "Unknown",
        "transactionCount": "222"
      }
    ]
  }
}
```

## Query 3: Marketplace Interactions with High Transaction Counts

This query retrieves the top four marketplaces with over 100 transactions, excluding "Unknown" marketplaces. Using enums as filters ensures that only valid marketplace types are included, increasing accuracy.

```gql
{
  marketplaceInteractions(
    first: 4
    orderBy: transactionCount
    orderDirection: desc
    where: { transactionCount_gt: "100", marketplace_not: "Unknown" }
  ) {
    marketplace
    transactionCount
  }
}
```

## Result 3

Expected output includes the marketplaces meeting the criteria, each represented by an enum value:

```gql
{
  "data": {
    "marketplaceInteractions": [
      {
        "marketplace": "NFTX",
        "transactionCount": "201"
      },
      {
        "marketplace": "OpenSeaV1",
        "transactionCount": "148"
      },
      {
        "marketplace": "CryptoCoven",
        "transactionCount": "117"
      },
      {
        "marketplace": "OpenSeaV1",
        "transactionCount": "111"
      }
    ]
  }
}
```

To dentify the most traded NFT (identified by tokenId) across various marketplaces, you can aggregate the data on the client-side (React and Apollo Client) data using a GraphQL query to fetch relevant NFT transfers, and then process that data in your client application.

## Step 1: GraphQL Query to Fetch NFT Transfers

First, let's fetch all NFT transfers. This query will allow us to gather data across all marketplaces without filtering for specific ones.

```gql
{
  covenTransfers {
    tokenId # Unique identifier for the NFT
    value # The value of the transaction (if applicable)
  }
}
```

This query returns all transfers of NFTs, providing us with the necessary data to analyze trading activity.

## Step 2: Apollo Client Setup in React

Next, you’ll fetch and process the data in your React component using Apollo Client.

```js
import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

// Step 1: Define the GraphQL query to fetch NFT transfers.
const GET_NFT_TRANSFERS = gql`
  query GetNFTTransfers {
    covenTransfers {
      tokenId # Unique identifier for each NFT transfer
      value # Transaction value, if applicable
    }
  }
`;

const MostTradedNFTAnalysis = () => {
  // Step 2: Execute the GraphQL query using Apollo's `useQuery` hook.
  // This hook sends the query to the GraphQL API and gives us `loading`, `error`, and `data` states.
  const { loading, error, data } = useQuery(GET_NFT_TRANSFERS);

  // Step 3: Create state to store the aggregated NFT transaction counts.
  // We will update this state as we process the data we receive from the query.
  const [nftCounts, setNftCounts] = useState({});

  // Step 4: Use the `useEffect` hook to process the query data when it's available.
  // React's `useEffect` runs the code inside whenever `data` changes (in this case, when the query finishes).
  useEffect(() => {
    if (data && covenTransfers) {
      const counts = {}; // Object to hold counts for each tokenId

      // Step 5: Loop through each NFT transfer to aggregate counts.
      data.covenTransfers.forEach((transfer) => {
        const tokenId = transfer.tokenId;

        // Step 6: Initialize the count for new tokenIds.
        if (!counts[tokenId]) {
          counts[tokenId] = 0; // Set initial count to zero
        }

        // Step 7: Increment the count for this tokenId.
        counts[tokenId]++;
      });

      // Step 8: Update the state with the aggregated counts.
      setNftCounts(counts);
    }
  }, [data]); // Effect runs when `data` changes.

  // Step 9: Handle the loading state.
  // If the query is still running, show a loading message.
  if (loading) return <p>Loading...</p>;

  // Step 10: Handle any errors that occurred during the query.
  // If there's an error, show an error message.
  if (error) return <p>Error: {error.message}</p>;

  // Step 11: Find the most traded NFT by determining the tokenId with the highest count.
  const mostTradedNFT = Object.entries(nftCounts).reduce(
    (acc, [tokenId, count]) => {
      return count > acc.count ? { tokenId, count } : acc; // Find max count
    },
    { tokenId: null, count: 0 }
  );

  // Step 2.14: Render the results.
  return (
    <div>
      <h2>Most Traded NFT</h2>
      {mostTradedNFT.tokenId ? (
        <p>
          Token ID: {mostTradedNFT.tokenId} - Trades: {mostTradedNFT.count}
        </p>
      ) : (
        <p>No NFT trades found.</p>
      )}
    </div>
  );
};

export default MostTradedNFTAnalysis;
```

## Frequently Asked Questions

- What are enums? Enums are a special data type that allow you to define a set of named values. They are particularly useful for categorizing data.

- Why should I use enums in my subgraph? Enums enhance clarity, validation, and maintainability of your data, making it easier to manage transactions.

## Conclusion

By implementing enums in your subgraph, you can improve data organization, clarity, and maintainability. This repository provides a foundational understanding of how to effectively use enums with the CryptoCoven contract.

For further reading, check out [The Graph's official documentation.](https://thegraph.com/docs/en/developing/creating-a-subgraph/#enums)
