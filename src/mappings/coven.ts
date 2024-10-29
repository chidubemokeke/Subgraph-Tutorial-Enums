// Import the Transfer event from the CryptoCoven contract ABI
import { Transfer as CovenTransferEvent } from "../../generated/CryptoCoven/CryptoCoven";
import { Address, log } from "@graphprotocol/graph-ts";

// Import the Transfer entity from the generated schema, allowing us to create and update Transfer records in the store
import { CovenTransfer, MarketplaceInteraction } from "../../generated/schema";

// Import constants representing marketplace addresses and utility values
import {
  ZERO_ADDRESS,
  BIGINT_ONE,
  OPENSEAV1,
  OPENSEAV2,
  SEAPORT,
  LOOKS_RARE,
  OXPROTOCOL,
  OXPROTOCOLV2,
  BLUR,
  RARIBLE,
  X2Y2,
  NFTX,
  GENIE_SWAP,
  CRYPTO_COVEN,
  BIGINT_ZERO,
} from "../utils/consts";

// Import helper functions that manage account creation and marketplace identification
import {
  getOrCreateAccount,
  getMarketplaceName,
  Marketplace,
} from "../utils/helper";

/**
 * Event handler for the Transfer event emitted by the CryptoCoven contract.
 * This function updates account information and creates a record of the transfer.
 *
 * @param event - The transfer event emitted by the smart contract
 */
export function handleTransfer(event: CovenTransferEvent): void {
  // Get or create account entities for 'from' and 'to' addresses
  let fromAccount = getOrCreateAccount(event.params.from);
  let toAccount = getOrCreateAccount(event.params.to);

  // Record the transaction hash for both sender and receiver accounts
  toAccount.txHash = event.transaction.hash;
  fromAccount.txHash = event.transaction.hash;

  /**
   * Update the covenSendCount for the 'from' account.
   * If this is the first transfer, initialize the count to 1.
   * Otherwise, increment the existing count.
   */
  fromAccount.sendCount = fromAccount.sendCount
    ? fromAccount.sendCount.plus(BIGINT_ONE)
    : BIGINT_ONE;

  /**
   * Update the covenReceiveCount for the 'to' account.
   * If this is the first transfer, initialize the count to 1.
   * Otherwise, increment the existing count.
   */
  toAccount.receiveCount = toAccount.receiveCount
    ? toAccount.receiveCount.plus(BIGINT_ONE)
    : BIGINT_ONE;

  /**
   * Update totalSpent for the receiver (toAccount).
   * totalSpent refers to the value sent in the transaction.
   * If totalSpent is null (first interaction), initialize it.
   * Otherwise, add the current transaction's value.
   */
  toAccount.totalSpent = toAccount.totalSpent
    ? toAccount.totalSpent.plus(event.transaction.value)
    : event.transaction.value;

  // If this is not a minting or burning transaction, handle it as a transfer.
  if (
    !event.params.from.equals(ZERO_ADDRESS) &&
    !event.params.to.equals(ZERO_ADDRESS)
  ) {
    // Decrease nftCount by 1 for the 'from' account, making sure it doesn’t go below zero.
    fromAccount.nftCount = fromAccount.nftCount
      ? fromAccount.nftCount.minus(BIGINT_ONE)
      : BIGINT_ZERO;

    // Increase nftCount by 1 for the 'to' account, initializing to 1 if it's the first transfer.
    toAccount.nftCount = toAccount.nftCount
      ? toAccount.nftCount.plus(BIGINT_ONE)
      : BIGINT_ONE;
  }

  fromAccount.save(); // Save the updated 'from' account
  toAccount.save(); // Save the updated 'to' account

  /**
   * Create a new Transfer entity to log the details of this specific transfer.
   * The ID is created by combining the transaction hash and the log index to ensure uniqueness.
   */
  let transfer = new CovenTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toHex()
  );

  // Set the 'from' and 'to' accounts in the Transfer entity
  transfer.from = fromAccount.id;
  transfer.to = toAccount.id;
  transfer.tokenId = event.params.tokenId;
  transfer.logIndex = event.logIndex;
  transfer.txHash = event.transaction.hash; // Transaction hash for reference

  // **Determine the Marketplace**

  /**Please note that this method is a simplifaction and only works for EOAs (User Wallet Addresses) directly interacting with the marketplace contracts.
     If a smart account or another contract interacts in this instance, the marketplace not be visible here. 
     To catch those edge cases, use transaction receipts and logs.**/

  let sender: Address | null = event.transaction.to; // Transaction 'to' address (potential marketplace contract address)
  let receiver: Address | null = event.transaction.from; // Transaction 'from' address (if the sender doesn't match)
  let marketplace: Marketplace = Marketplace.Unknown; // Default to unknown marketplace to log txHash for debugging.

  if (sender && receiver) {
    // Compare addresses with known marketplaces
    if (sender.equals(OPENSEAV1) || receiver.equals(OPENSEAV1)) {
      marketplace = Marketplace.OpenSeaV1; // Set marketplace to OpenSeaV1 if matched
    } else if (sender.equals(OPENSEAV2) || receiver.equals(OPENSEAV2)) {
      marketplace = Marketplace.OpenSeaV2; // Set marketplace to OpenSeaV2 if matched
    } else if (sender.equals(SEAPORT) || receiver.equals(SEAPORT)) {
      marketplace = Marketplace.SeaPort; // Set marketplace to SeaPort if matched
    } else if (sender.equals(LOOKS_RARE) || receiver.equals(LOOKS_RARE)) {
      marketplace = Marketplace.LooksRare; // Set marketplace to LooksRare if matched
    } else if (sender.equals(OXPROTOCOL) || receiver.equals(OXPROTOCOL)) {
      marketplace = Marketplace.OxProtocol; // Set marketplace to OxProtocol if matched
    } else if (sender.equals(OXPROTOCOLV2) || receiver.equals(OXPROTOCOLV2)) {
      marketplace = Marketplace.OxProtocolV2; // Set marketplace to OxProtocolV2 if matched
    } else if (sender.equals(BLUR) || receiver.equals(BLUR)) {
      marketplace = Marketplace.Blur; // Set marketplace to Blur if matched
    } else if (sender.equals(RARIBLE) || receiver.equals(RARIBLE)) {
      marketplace = Marketplace.Rarible; // Set marketplace to Rarible if matched
    } else if (sender.equals(X2Y2) || receiver.equals(X2Y2)) {
      marketplace = Marketplace.X2Y2; // Set marketplace to X2Y2 if matched
    } else if (sender.equals(NFTX) || receiver.equals(NFTX)) {
      marketplace = Marketplace.NFTX; // Set marketplace to NFTX if matched
    } else if (sender.equals(GENIE_SWAP) || receiver.equals(GENIE_SWAP)) {
      marketplace = Marketplace.GenieSwap; // Set marketplace to GenieSwap if matched
    } else if (sender.equals(CRYPTO_COVEN) || receiver.equals(CRYPTO_COVEN)) {
      marketplace = Marketplace.CryptoCoven; // Set marketplace to CryptoCoven if matched
    }
  }

  // Handle marketplace cases
  if (marketplace === Marketplace.Unknown) {
    log.info("Unknown MarketPlace: {}", [event.transaction.hash.toHexString()]);
  } else if (sender === ZERO_ADDRESS) {
    log.info("NFT Burn detected: {}", [event.transaction.hash.toHexString()]);
  } else if (!sender || !receiver) {
    log.info("Unusual Activity: {}", [event.transaction.hash.toHexString()]);
  }

  // Store the transaction value and marketplace name in the Transfer entity for future reference
  transfer.value = event.transaction.value; // Record the value of the transaction
  transfer.marketplace = getMarketplaceName(marketplace); // Retrieve the marketplace name as a string

  // Track unique marketplace interactions for 'from' and 'to' accounts
if (
  !event.params.from.equals(ZERO_ADDRESS) &&
  !event.params.to.equals(ZERO_ADDRESS)
) {
  // **From Account Marketplace Interaction**
  // Create a unique ID for 'from' account's interaction with the marketplace
  let fromMarketplaceInteractionId =
    fromAccount.id + "-" + marketplace.toString();
  
  // Load any existing interaction record for this ID
  let fromInteraction = MarketplaceInteraction.load(fromMarketplaceInteractionId);

  // Check if this interaction already exists
  if (fromInteraction == null) {
    // First interaction with this marketplace for 'from' account
    // Initialize a new interaction record
    fromInteraction = new MarketplaceInteraction(fromMarketplaceInteractionId);
    fromInteraction.account = fromAccount.id; // Set the 'from' account ID
    fromInteraction.marketplace = getMarketplaceName(marketplace); // Set marketplace name
    fromInteraction.transactionCount = BIGINT_ONE; // Initialize transaction count to 1
    fromAccount.uniqueMarketplacesCount =
      fromAccount.uniqueMarketplacesCount.plus(BIGINT_ONE); // Increment unique marketplace count for 'from' account
  } else {
    // Interaction exists; increment transaction count
    fromInteraction.transactionCount =
      fromInteraction.transactionCount.plus(BIGINT_ONE);
  }
  fromInteraction.save(); // Save the updated or new interaction record for 'from' account

  // **To Account Marketplace Interaction**
  // Create a unique ID for 'to' account's interaction with the marketplace
  let toMarketplaceInteractionId =
    toAccount.id + "-" + marketplace.toString();
  
  // Load any existing interaction record for this ID
  let toInteraction = MarketplaceInteraction.load(toMarketplaceInteractionId);

  // Check if this interaction already exists
  if (toInteraction == null) {
    // First interaction with this marketplace for 'to' account
    // Initialize a new interaction record
    toInteraction = new MarketplaceInteraction(toMarketplaceInteractionId);
    toInteraction.account = toAccount.id; // Set the 'to' account ID
    toInteraction.marketplace = getMarketplaceName(marketplace); // Set marketplace name
    toInteraction.transactionCount = BIGINT_ONE; // Initialize transaction count to 1
    toAccount.uniqueMarketplacesCount =
      toAccount.uniqueMarketplacesCount.plus(BIGINT_ONE); // Increment unique marketplace count for 'to' account
  } else {
    // Interaction exists; increment transaction count
    toInteraction.transactionCount =
      toInteraction.transactionCount.plus(BIGINT_ONE);
  }
  toInteraction.save(); // Save the updated or new interaction record for 'to' account

  // Save the updated account data for both 'from' and 'to' accounts
  fromAccount.save();
  toAccount.save();

  // Save any updated data in the transfer entity
  transfer.save();
} else {
  // Skip tracking interactions if the transfer involves the zero address (indicating a mint or burn)
  log.info(
    "Skipping marketplace interaction tracking for zero address transfers: {}",
    [event.transaction.hash.toHexString()]
  );
}
