import RolimonsItemDetails from "../rolimons/RolimonsItemDetails";
import ItemsDetailsQueryParamsDTO from "../roblox/ItemsDetailsQueryParamsDTO";
import RobloxService from "../roblox/RobloxService";
import RolimonsService from "../rolimons/RolimonsService";
import AssetDetailsPurchaseDTO from "../roblox/AssetDetailsPurchaseDTO";
import Strategy from "../strategy/Strategy";

export default class UGCLimitedSniperStrategy extends Strategy {
  #robloxService;
  #rolimonsService;

  maxPrice = 3;
  spamMultiplier = 4;
  checkAvailableForConsumption = true;

  /**
   *
   * @param {string} ROBLOSECURITY
   * @param {RobloxService} robloxService
   * @param {RolimonsService} rolimonsService
   */
  constructor(ROBLOSECURITY, robloxService, rolimonsService) {
    super(ROBLOSECURITY, robloxService);
    this.#robloxService = robloxService;
    this.#rolimonsService = rolimonsService;
  }

  /**
   *
   * @see {@link UGCLimitedSniperStrategy.spamMultiplier}
   * @param {any[]} catalogsDetailsOrAssetDetails
   * @returns
   */
  async spamManyPurchasesByCatalogsDetailsOrAssetDetails(
    catalogsDetailsOrAssetDetails
  ) {
    const purchases = [];

    const isAssetDetails = catalogsDetailsOrAssetDetails.reduce(
      (p, c) => "collectibleProductId" in c || p,
      false
    );

    const assetsDetails = isAssetDetails
      ? catalogsDetailsOrAssetDetails
      : await this.#robloxService.findManyAssetDetailsByItemIds(
          catalogsDetailsOrAssetDetails.map(
            ({ collectibleItemId }) => collectibleItemId
          )
        );

    for (const assetDetails of assetsDetails) {
      if (
        assetDetails.price <= this.maxPrice &&
        (this.checkAvailableForConsumption
          ? assetDetails.unitsAvailableForConsumption > 0
          : true)
      ) {
        for (let m = 0; m < this.spamMultiplier; m++) {
          purchases.push(
            this.#robloxService.purchaseAssetDetails(
              new AssetDetailsPurchaseDTO(
                assetDetails.creatorId,
                assetDetails.collectibleProductId,
                this.user.id,
                assetDetails.collectibleItemId,
                assetDetails.price,
                assetDetails.creatorType
              )
            )
          );
        }
      }
    }

    return Promise.all(purchases);
  }

  async snipeRolimonsCatalogLastProduct(ignoreProductAfter = 30_000) {
    const rolimonsItemDetails =
      await this.#rolimonsService.findManyRolimonsItemsDetails();

    const notIgnoreProduct =
      rolimonsItemDetails.itemDetails[0][1][1] == 0 &&
      RolimonsItemDetails.formatTimestamp(
        rolimonsItemDetails.itemDetails[0][1][2]
      ).getTime() +
        ignoreProductAfter >
        Date.now();

    if (notIgnoreProduct) {
      const catalogDetails =
        await this.#robloxService.findManyCatalogDetailByItemsDetails([
          new ItemsDetailsQueryParamsDTO(
            "Asset",
            Number.parseInt(rolimonsItemDetails.itemDetails[0][0])
          ),
        ]);

      return this.spamManyPurchasesByCatalogsDetailsOrAssetDetails([
        catalogDetails,
      ]);
    }
  }

  snipeRobloxAssetsDetails() {
    return this.#robloxService
      .findManyCollectableAssetDetails(this.maxPrice)
      .then((assetsDetails) =>
        this.spamManyPurchasesByCatalogsDetailsOrAssetDetails(assetsDetails)
      );
  }

  /**
   *
   * @param {number[]} productsId
   * @returns
   */
  async snipeProductByIds(productsId) {
    const productCatalogDetails =
      await this.#robloxService.findManyCatalogDetailByItemsDetails(
        productsId.map(
          (productId) => new ItemsDetailsQueryParamsDTO("Asset", productId)
        )
      );

    return this.spamManyPurchasesByCatalogsDetailsOrAssetDetails(
      productCatalogDetails
    );
  }
}
