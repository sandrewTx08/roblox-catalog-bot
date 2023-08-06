import { randomUUID } from "crypto";
import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO";

export default class AssetDetailsFreePurchaseDTO extends AssetDetailsPurchaseDTO {
  expectedSellerId;
  collectibleProductId;
  expectedPurchaserId;
  collectibleItemId;

  /**
   *
   * @param {number} expectedSellerIdOrcreatorTargetId
   * @param {number} collectibleProductId
   * @param {string} collectibleItemId
   */
  constructor(
    expectedSellerIdOrcreatorTargetId,
    collectibleProductId,
    collectibleItemId
  ) {
    super(
      expectedSellerIdOrcreatorTargetId,
      collectibleProductId,
      NaN,
      collectibleItemId,
      0,
      1,
      "User",
      "User"
    );
  }
}
