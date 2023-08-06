import AssetDetailsFreePurchaseDTO from "../roblox/AssetDetailsFreePurchaseDTO";
import User from "../user/User";
import RobloxRepository from "../roblox/RobloxRepository";
import RobloxService from "../roblox/RobloxService";
import RolimonsItemDetails from "../rolimons/RolimonsItemDetails";
import RolimonsRepository from "../rolimons/RolimonsRepository";
import RolimonsService from "../rolimons/RolimonsService";
import axios from "axios";
import ItemsDetailsQueryParamsDTO from "../roblox/ItemsDetailsQueryParamsDTO";

export default class UGCLimitedSniperController {
  #robloxService;
  #rolimonsService;

  /** @type {User} */
  #user;

  spamMultiplier = 20;
  checkAvailableForConsumption = false;

  constructor(ROBLOSECURITY) {
    axios.defaults.headers.common.Cookie = `.ROBLOSECURITY=${ROBLOSECURITY};`;
    this.#rolimonsService = new RolimonsService(new RolimonsRepository());
    this.#robloxService = new RobloxService(new RobloxRepository());
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
        await this.#robloxService.findFirstAssetDetailsByCollectibleItemIds(
          catalogDetails.collectibleItemId
        );

      return this.#robloxService.purchaseFreeAssetDetails(
        new AssetDetailsFreePurchaseDTO(
          catalogDetails.creatorTargetId,
          assetDetails.collectibleProductId,
          catalogDetails.collectibleItemId
        ),
        this.#user.id
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
}
