import AssetDetailsPurchaseDTO from "../roblox/AssetDetailsPurchaseDTO.js";
import User from "../user/User.js";
import RobloxRepository from "../roblox/RobloxRepository.js";
import RobloxService from "../roblox/RobloxService.js";
import RolimonsItemDetails from "../rolimons/RolimonsItemDetails.js";
import RolimonsRespository from "../rolimons/RolimonsRepository.js";
import RolimonsService from "../rolimons/RolimonsService.js";
import axios from "axios";

export class UGCLimitedSniperController {
  #robloxService;
  #rolimonsService;

  /** @type {User} */
  #user;

  spamMultiplier = 20;
  checkAvailableForConsumption = false;

  constructor(ROBLOSECURITY) {
    axios.defaults.headers.common.Cookie = `.ROBLOSECURITY=${ROBLOSECURITY};`;
    this.#rolimonsService = new RolimonsService(new RolimonsRespository());
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
        await this.#robloxService.findOneAssetDetailsByCollectibleItemId(
          catalogDetails.collectibleItemId
        );

      return this.#robloxService.purchaseAssetDetails(
        new AssetDetailsPurchaseDTO(
          catalogDetails.collectibleItemId,
          assetDetails.collectibleProductId,
          catalogDetails.creatorTargetId
        ),
        this.#user.id
      );
    }
  }

  async snipeRolimonsCatalogLastProduct(ignoreProductAfter = 30_000) {
    const rolimonsItemDetails =
      await this.#rolimonsService.findManyRolimonsItemsDetails();

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

export default UGCLimitedSniperController;
