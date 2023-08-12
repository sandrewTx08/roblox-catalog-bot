import { randomUUID } from "crypto";

export default class AssetDetailsPurchaseDTO {
  collectibleProductId;
  collectibleItemId;
  expectedPrice;
  expectedSellerId;
  expectedSellerType;
  expectedPurchaserId;
  expectedPurchaserType = "User";
  expectedCurrency = 1;
  idempotencyKey = randomUUID();

  /**
   *
   * @param {number} expectedSellerIdOrCreatorTargetId
   * @param {string} collectibleProductId
   * @param {number} expectedPurchaserId
   * @param {string} collectibleItemId
   * @param {number} expectedPrice
   * @param {string} expectedSellerType
   */
  constructor(
    expectedSellerIdOrCreatorTargetId,
    collectibleProductId,
    expectedPurchaserId,
    collectibleItemId,
    expectedPrice,
    expectedSellerType
  ) {
    this.expectedSellerId = expectedSellerIdOrCreatorTargetId;
    this.collectibleProductId = collectibleProductId;
    this.expectedPurchaserId = expectedPurchaserId;
    this.collectibleItemId = collectibleItemId;
    this.expectedPrice = expectedPrice;
    this.expectedSellerType = expectedSellerType;
  }
}
