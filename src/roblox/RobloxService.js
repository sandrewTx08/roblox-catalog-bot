import axios from "axios";
import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO.js";
import User from "../user/User.js";
import RobloxRepository from "./RobloxRepository.js";

export class RobloxService {
  #robloxRepository;

  /**
   *
   * @param {RobloxRepository} robloxRepository
   */
  constructor(robloxRepository) {
    this.#robloxRepository = robloxRepository;
  }

  findManyLimitedsAssetDetails(Limit = 10) {
    return this.#robloxRepository
      .findManyLimitedsAssetDetails({
        Category: 1,
        salesTypeFilter: 2,
        SortType: 3,
        IncludeNotForSale: true,
        Limit,
      })
      .then(({ data }) => data);
  }

  getXCsrfToken() {
    return this.#robloxRepository
      .getXCsrfToken()
      .catch(({ response }) => response)
      .then(({ headers }) => headers["x-csrf-token"]);
  }

  getUser() {
    return this.#robloxRepository
      .getUserByEmailSignInValidation()
      .catch(({ response }) => response)
      .then(({ data }) => new User(data.id));
  }

  findOneCatalogDetailByProductId(productId) {
    return this.#robloxRepository
      .findOneCatalogDetailByProductId(productId)
      .then(
        ({
          data: {
            data: [catalogDetails],
          },
        }) => catalogDetails
      );
  }

  findOneAssetDetailsByCollectibleItemId(collectibleItemId) {
    return this.#robloxRepository
      .findOneAssetDetailsByCollectibleItemId(collectibleItemId)
      .then(({ data: [assetDetails] }) => assetDetails);
  }

  /**
   *
   * @param {AssetDetailsPurchaseDTO} assetDetailsPurchaseDTO
   * @returns
   */
  purchaseAssetDetails(assetDetailsPurchaseDTO, userId) {
    assetDetailsPurchaseDTO.expectedPurchaserId = userId;

    return axios
      .post(
        `https://apis.roblox.com/marketplace-sales/v1/item/${assetDetailsPurchaseDTO.collectibleItemId}/purchase-item`,
        assetDetailsPurchaseDTO
      )
      .catch(({ response }) => response);
  }
}

export default RobloxService;
