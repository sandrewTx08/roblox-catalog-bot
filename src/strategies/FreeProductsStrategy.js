import ProductPurchaseDTO from "../roblox/ProductPurchaseDTO";
import RobloxService from "../roblox/RobloxService";
import Strategy from "../strategy/Strategy";

export default class FreeProductsStrategy extends Strategy {
  #robloxService;

  purchasesTimeout = 60_000;

  /**
   *
   * @param {string} ROBLOSECURITY
   * @param {RobloxService} robloxService
   */
  constructor(ROBLOSECURITY, robloxService) {
    super(ROBLOSECURITY, robloxService);
    this.#robloxService = robloxService;
  }

  /**
   *
   * @see {@link FreeProductsStrategy.purchasesTimeout}
   * @returns
   */
  async purchaseManyFreeProducts() {
    const purchases = [];

    const assetsDetails =
      await this.#robloxService.findManyFreeProductsAssetDetails();

    for (let i = 0; i < assetsDetails.length; i++) {
      purchases.push(
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                this.#robloxService.purchaseProduct(
                  assetsDetails[i].productId,
                  new ProductPurchaseDTO(0, 0, assetsDetails[i].creatorTargetId)
                )
              ),
            this.purchasesTimeout * i
          )
        )
      );
    }

    return Promise.all(purchases);
  }
}
