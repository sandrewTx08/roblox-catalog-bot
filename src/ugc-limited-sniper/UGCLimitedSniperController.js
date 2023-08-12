import AssetDetailsFreePurchaseDTO from "../roblox/AssetDetailsFreePurchaseDTO";
import User from "../user/User";
import RolimonsItemDetails from "../rolimons/RolimonsItemDetails";
import axios from "axios";
import ItemsDetailsQueryParamsDTO from "../roblox/ItemsDetailsQueryParamsDTO";
import RobloxService from "../roblox/RobloxService";
import RolimonsService from "../rolimons/RolimonsService";

export default class UGCLimitedSniperController {
  /**
   *
   * @type {User}
   */
  #user;
  #robloxService;
  #rolimonsService;

  spamMultiplier = 20;
  checkAvailableForConsumption = false;

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

  /**
   *
   * @param {number} expectedSellerIdOrcreatorTargetId
   * @param {number} collectibleProductId
   * @param {string} collectibleItemId
   * @returns
   */
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

  /**
   *
   * @param {any[]} catalogsDetailsOrAssetDetails
   * @returns
   */
  async spamManyPurchaseByCatalogsDetailsOrAssetDetails(
    catalogsDetailsOrAssetDetails
  ) {
    const purchases = [];

    const isCatalogDetails = catalogsDetailsOrAssetDetails.reduce(
      (p, c) => "collectibleProductId" in c || p,
      false
    );

    const assetsDetails = isCatalogDetails
      ? await this.#robloxService.findManyAssetDetailsByCollectibleItemIds(
          catalogsDetailsOrAssetDetails.map(
            ({ collectibleItemId }) => collectibleItemId
          )
        )
      : catalogsDetailsOrAssetDetails;

    for (const assetDetails of assetsDetails) {
      if (
        this.checkAvailableForConsumption
          ? assetDetails.unitsAvailableForConsumption > 0
          : true
      ) {
        for (let m = 0; m < this.spamMultiplier; m++) {
          purchases.push(
            this.purchaseFreeAssetDetails(
              assetDetails.creatorId,
              assetDetails.collectibleProductId,
              assetDetails.collectibleItemId
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

      return this.spamManyPurchaseByCatalogsDetailsOrAssetDetails([
        catalogDetails,
      ]);
    }
  }

  async snipeRobloxCatalogLastProduct() {
    const {
      data: [catalogDetails],
    } = await this.#robloxService.findManyCollectableAssetDetails();

    if (catalogDetails.price == 0)
      return this.spamManyPurchaseByCatalogsDetailsOrAssetDetails([
        catalogDetails,
      ]);
  }

  /**
   *
   * @param {number[]} productsId
   */
  async snipeProductByIds(productsId) {
    const productCatalogDetails =
      await this.#robloxService.findManyCatalogDetailByItemsDetails(
        productsId.map(
          (productId) => new ItemsDetailsQueryParamsDTO("Asset", productId)
        )
      );

    this.spamManyPurchaseByCatalogsDetailsOrAssetDetails(productCatalogDetails);
  }
}
