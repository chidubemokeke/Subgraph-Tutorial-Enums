// Import the Account entity type from the generated schema
import { Account } from "../../generated/schema";
// Import required types from the Graph Protocol library
import { Bytes } from "@graphprotocol/graph-ts";
import { BIGINT_ZERO } from "./consts";

export enum Marketplace {
  OpenSeaV1,
  OpenSeaV2,
  SeaPort,
  LooksRare,
  OxProtocol,
  OxProtocolV2,
  Blur,
  Rarible,
  X2Y2,
  NFTX,
  GenieSwap,
  CryptoCoven,
  Unknown,
}

// Function to get or create an Account entity based on an Ethereum address
export function getOrCreateAccount(address: Bytes): Account {
  // Convert the provided Ethereum address to a hexadecimal string for use as the unique ID for the Account entity
  let accountId = address.toHex();

  // Try to load the account entity from the store using the accountId
  let account = Account.load(accountId);

  // Check if the account entity exists in the store
  if (account == null) {
    // If the account does not exist, create a new Account entity
    account = new Account(accountId); // Use accountId as the unique identifier

    // Initialize fields for the new account entity
    account.totalSpent = BIGINT_ZERO; // Initialize the total spent amount to 0 (BigInt type)
    account.sendCount = BIGINT_ZERO; // Initialize the count of NFTs sent to 0
    account.receiveCount = BIGINT_ZERO; // Initialize the count of NFTs received to 0
    account.nftCount = BIGINT_ZERO;
    account.uniqueMarketplacesCount = BIGINT_ZERO; // Initialize the count of market places interacted with
    account.txHash = Bytes.empty();

    // Save the newly created account entity to the store to persist its state
    account.save();
  }
  // Return the account entity, which will be either the existing one or the newly created one
  return account as Account;
}

/**
 * Converts a Marketplace enum value to its corresponding string representation.
 *
 * @param marketplace - The Marketplace enum value to convert.
 * @returns A string representing the name of the marketplace.
 */
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
