import AssetDetailsFreePurchaseDTO from "../roblox/AssetDetailsFreePurchaseDTO";
import User from "../user/User";
import RolimonsItemDetails from "../rolimons/RolimonsItemDetails";
import axios from "axios";
import ItemsDetailsQueryParamsDTO from "../roblox/ItemsDetailsQueryParamsDTO";
import RobloxService from "../roblox/RobloxService";
import RolimonsService from "../rolimons/RolimonsService";

export default class UGCLimitedSniperController {
  #robloxService;
  #rolimonsService;

  /**
   *
   * @type {User}
   */
  #user;

  /**
   *
   * @param {RobloxService} robloxRepository
   * @param {RolimonsService} rolimonsService
   */
  constructor(robloxRepository, rolimonsService) {
    this.#robloxService = robloxRepository;
    this.#rolimonsService = rolimonsService;
  }

  spamMultiplier = 20;
  checkAvailableForConsumption = false;

  setUser() {
    return this.#robloxService
      .getUser()
      .catch(({ response }) => response)
      .then((user) => {
        this.#user = user;
      });
  }

  setXCsrfToken() {
    return this.#robloxService.getXCsrfToken().then((xCsrfToken) => {
      axios.defaults.headers.common["x-csrf-token"] =
        xCsrfToken || axios.defaults.headers.common["x-csrf-token"] || "";
    });
  }

  spamPurchaseCatalogDetails(catalogDetails) {
    const purchases = [];

    for (let multiplier = 0; multiplier < this.spamMultiplier; multiplier++)
      purchases.push(this.purchaseOneCatalogDetails(catalogDetails));

    return Promise.all(purchases);
  }

  purchaseFreeAssetDetails(
    expectedSellerIdOrcreatorTargetId,
    collectibleProductId,
    collectibleItemId
  ) {
    return this.#robloxService.purchaseFreeAssetDetails(
      new AssetDetailsFreePurchaseDTO(
        expectedSellerIdOrcreatorTargetId,
        collectibleProductId,
        collectibleItemId
      ),
      this.#user.id
    );
  }

  async purchaseOneCatalogDetails(catalogDetails) {
    if (
      this.checkAvailableForConsumption
        ? catalogDetails.unitsAvailableForConsumption > 0
        : true
    ) {
      const assetDetails =
        await this.#robloxService.findFirstAssetDetailsByCollectibleItemIds(
          catalogDetails.collectibleItemId
        );

      return this.purchaseFreeAssetDetails(
        catalogDetails.creatorTargetId,
        assetDetails.collectibleProductId,
        catalogDetails.collectibleItemId
      );
    }
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

      return this.spamPurchaseCatalogDetails(catalogDetails);
    }
  }

  async snipeRobloxCatalogLastProduct() {
    const {
      data: [catalogDetails],
    } = await this.#robloxService.findManyCollectableAssetDetails();

    if (catalogDetails.price == 0)
      return this.spamPurchaseCatalogDetails(catalogDetails);
  }

  /**
   *
   * @param {number[]} productsId
   */
  async snipeProductsById(productsId) {
    const productsCatalogDetails =
      await this.#robloxService.findManyCatalogDetailByItemsDetails(
        productsId.map(
          (productId) => new ItemsDetailsQueryParamsDTO("Asset", productId)
        )
      );

    const productsAssetDetails =
      await this.#robloxService.findManyAssetDetailsByCollectibleItemIds(
        productsCatalogDetails.map(
          (catalogDetails) => catalogDetails.collectibleItemId
        )
      );

    return Promise.all(
      productsAssetDetails.map(
        ({ creatorId, collectibleProductId, collectibleItemId }) =>
          this.purchaseFreeAssetDetails(
            creatorId,
            collectibleProductId,
            collectibleItemId
          )
      )
    );
  }
}
