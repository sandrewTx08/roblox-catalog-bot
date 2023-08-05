import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO.js";
import RobloxService from "./RobloxService.js";
import RolimonsItemDetails from "./RolimonsItemDetails.js";
import RolimonsService from "./RolimonsService.js";

export class UGCLimitedSniper {
  #robloxService;

  spamMultiplier = 20;
  checkAvailableForConsumption = false;

  /**
   *
   * @param {RobloxService} robloxService
   */
  constructor(robloxService) {
    this.#robloxService = robloxService;
  }

  spamPurchaseCatalogDetails(catalogDetails) {
    const purchases = [];

    for (let multiplier = 0; multiplier < this.spamMultiplier; multiplier++)
      purchases.push(this.purchaseCatalogDetails(catalogDetails));

    return Promise.all(purchases);
  }

  async purchaseCatalogDetails(catalogDetails) {
    if (
      this.checkAvailableForConsumption
        ? catalogDetails.unitsAvailableForConsumption > 0
        : true
    ) {
      const assetDetails =
        await this.#robloxService.findOneAssetDetailsByCollectibleItemId(
          catalogDetails.collectibleItemId
        );

      return this.#robloxService.purchaseAssetDetails(
        new AssetDetailsPurchaseDTO(
          catalogDetails.collectibleItemId,
          assetDetails.collectibleProductId,
          catalogDetails.creatorTargetId
        )
      );
    }
  }

  async snipeRolimonsCatalogLastProduct(ignoreProductAfter = 30_000) {
    const rolimonsItemDetails =
      await new RolimonsService().findManyRolimonsItemsDetails();

    const ignoreProduct =
      rolimonsItemDetails.itemDetails[0][1][1] == 0 &&
      RolimonsItemDetails.formatTimestamp(
        rolimonsItemDetails.itemDetails[0][1][2]
      ).getTime() +
        ignoreProductAfter >
        new Date().getTime();

    if (ignoreProduct) {
      const catalogDetails =
        await this.#robloxService.findOneCatalogDetailByProductId(
          rolimonsItemDetails.itemDetails[0][0]
        );

      return this.spamPurchaseCatalogDetails(catalogDetails);
    }
  }

  async snipeRobloxCatalogLastProduct() {
    const {
      data: [catalogDetails],
    } = await this.#robloxService.findManyLimitedsAssetDetails();

    if (catalogDetails.price == 0)
      return this.spamPurchaseCatalogDetails(catalogDetails);
  }
}

export default UGCLimitedSniper;
