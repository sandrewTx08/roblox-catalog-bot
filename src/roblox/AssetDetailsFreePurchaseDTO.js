import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO";

export default class AssetDetailsFreePurchaseDTO extends AssetDetailsPurchaseDTO {
  /**
   *
   * @param {number} expectedSellerIdOrCreatorTargetId
   * @param {string} collectibleProductId
   * @param {string} collectibleItemId
   */
  constructor(
    expectedSellerIdOrCreatorTargetId,
    collectibleProductId,
    collectibleItemId
  ) {
    super(
      expectedSellerIdOrCreatorTargetId,
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
