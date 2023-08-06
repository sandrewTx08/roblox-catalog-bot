import { randomUUID } from "crypto";

export default class AssetDetailsPurchaseDTO {
  expectedSellerId;
  collectibleProductId;
  expectedPurchaserId;
  collectibleItemId;
  expectedPrice;
  expectedCurrency;
  expectedSellerType;
  expectedPurchaserType;
  idempotencyKey = randomUUID();

  /**
   *
   * @param {number} expectedSellerIdOrcreatorTargetId
   * @param {number} collectibleProductId
   * @param {number} expectedPurchaserId
   * @param {string} collectibleItemId
   * @param {number} expectedPrice
   * @param {number} expectedCurrency
   * @param {string} expectedSellerType
   * @param {string} expectedPurchaserType
   */
  constructor(
    expectedSellerIdOrcreatorTargetId,
    collectibleProductId,
    expectedPurchaserId,
    collectibleItemId,
    expectedPrice,
    expectedCurrency,
    expectedSellerType,
    expectedPurchaserType
  ) {
    this.expectedSellerId = expectedSellerIdOrcreatorTargetId;
    this.collectibleProductId = collectibleProductId;
    this.expectedPurchaserId = expectedPurchaserId;
    this.collectibleItemId = collectibleItemId;
    this.expectedPrice = expectedPrice;
    this.expectedCurrency = expectedCurrency;
    this.expectedPurchaserType = expectedPurchaserType;
    this.expectedSellerType = expectedSellerType;
  }
}
