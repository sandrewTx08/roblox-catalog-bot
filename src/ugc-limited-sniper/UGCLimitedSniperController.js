import User from "../user/User";
import RolimonsItemDetails from "../rolimons/RolimonsItemDetails";
import axios from "axios";
import ItemsDetailsQueryParamsDTO from "../roblox/ItemsDetailsQueryParamsDTO";
import RobloxService from "../roblox/RobloxService";
import RolimonsService from "../rolimons/RolimonsService";
import AssetDetailsPurchaseDTO from "../roblox/AssetDetailsPurchaseDTO";

export default class UGCLimitedSniperController {
  /**
   *
   * @type {User}
   */
  #user;
  #robloxService;
  #rolimonsService;

  maxPrice = 2;
  spamMultiplier = 4;
  checkAvailableForConsumption = true;

  /**
   *
   * @param {RobloxService} robloxRepository
   * @param {RolimonsService} rolimonsService
   */
  constructor(robloxRepository, rolimonsService) {
    this.#robloxService = robloxRepository;
    this.#rolimonsService = rolimonsService;
  }

  setUser() {
    return this.#robloxService.getUser().then((user) => {
      this.#user = user;
      return this;
    });
  }

  setXCsrfToken() {
    return this.#robloxService.getXCsrfToken().then((xCsrfToken) => {
      axios.defaults.headers.common["x-csrf-token"] =
        xCsrfToken || axios.defaults.headers.common["x-csrf-token"] || "";
      return this;
    });
  }

  /**
   *
   * @see {@link UGCLimitedSniperController.spamMultiplier}
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
      : await this.#robloxService.findManyAssetDetailsByCollectibleItemIds(
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
                this.#user.id,
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
        await this.#robloxService.findFirstCatalogDetailByItemDetails(
          new ItemsDetailsQueryParamsDTO(
            "Asset",
            Number.parseInt(rolimonsItemDetails.itemDetails[0][0])
          )
        );

      return this.spamManyPurchasesByCatalogsDetailsOrAssetDetails([
        catalogDetails,
      ]);
    }
  }

  snipeRobloxAssetsDetails() {
    return this.#robloxService
      .findManyCollectableAssetDetails()
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
