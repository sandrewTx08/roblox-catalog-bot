import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO.js";
import RobloxService from "./RobloxService.js";
import RolimonsScraper from "./RolimonsScraper.js";
import RolimonsItemDetails from "./RolimonsItemDetails.js";
import RolimonsService from "./RolimousService.js";

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

  async snipeRolimonsLastProduct(ignoreProductsAfter = 30000) {
    const { data } = await RolimonsService.marketplaceNew();
    const rolimonsItemDetails = new RolimonsItemDetails(
      new RolimonsScraper(data).rolimonsItemDetails()
    );

    if (
      rolimonsItemDetails.itemDetails[0][1][1] == 0 &&
      RolimonsItemDetails.formatTimestamp(
        rolimonsItemDetails.itemDetails[0][1][2]
      ).getTime() +
        ignoreProductsAfter >
        new Date().getTime()
    ) {
      const catalogDetails =
        await this.#robloxService.findOneCatalogDetailByProductId(
          rolimonsItemDetails.itemDetails[0][0]
        );

      return this.spamPurchaseCatalogDetails(catalogDetails);
    }
  }

  async snipeRobloxApiLastProduct() {
    const {
      data: [catalogDetails],
    } = await this.#robloxService.findManyLimitedsAssetDetails();

    if (catalogDetails.price == 0)
      return this.spamPurchaseCatalogDetails(catalogDetails);
  }
}

export default UGCLimitedSniper;
