import { randomUUID } from "crypto";
import User from "../user/User";

export class AssetDetailsPurchaseDTO {
  expectedSellerId;
  collectibleProductId;
  expectedPurchaserId;
  collectibleItemId;
  expectedPrice = 0;
  expectedCurrency = 1;
  expectedSellerType = "User";
  idempotencyKey = randomUUID();
  expectedPurchaserType = "User";

  /**
   * @param {string} collectibleItemId
   * @param {number} collectibleProductId
   * @param {number} expectedSellerIdOrcreatorTargetId
   */
  constructor(
    collectibleItemId,
    collectibleProductId,
    expectedSellerIdOrcreatorTargetId
  ) {
    this.collectibleItemId = collectibleItemId;
    this.collectibleProductId = collectibleProductId;
    this.expectedSellerId = expectedSellerIdOrcreatorTargetId;
  }
}

export default AssetDetailsPurchaseDTO;
