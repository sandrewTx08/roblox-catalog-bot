import ProductPurchaseDTO from "../roblox/ProductPurchaseDTO";
import RobloxService from "../roblox/RobloxService";
import Strategy from "../strategy/Strategy";

export default class FreeProductsStrategy extends Strategy {
  #robloxService;

  /**
   *
   * @param {string} ROBLOSECURITY
   * @param {RobloxService} robloxService
   */
  constructor(ROBLOSECURITY, robloxService) {
    super(ROBLOSECURITY, robloxService);
    this.#robloxService = robloxService;
  }

  purchaseManyFreeProducts() {
    return this.#robloxService
      .findManyFreeProductsAssetDetails()
      .then((assetsDetails) =>
        assetsDetails.map((assetDetails) =>
          this.#robloxService.purchaseProduct(
            assetDetails.id,
            new ProductPurchaseDTO(0, 0, assetDetails.creatorTargetId)
          )
        )
      );
  }
}
