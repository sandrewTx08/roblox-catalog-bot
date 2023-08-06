import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO";
import User from "../user/User";
import RobloxRepository from "./RobloxRepository";

export class RobloxService {
  #robloxRepository;

  /**
   *
   * @param {RobloxRepository} robloxRepository
   */
  constructor(robloxRepository) {
    this.#robloxRepository = robloxRepository;
  }

  findManyLimitedsAssetDetails() {
    return this.#robloxRepository
      .findManyLimitedsAssetDetails({
        Category: 1,
        salesTypeFilter: 2,
        SortType: 3,
        IncludeNotForSale: true,
        Limit: 10,
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
   * @param {number} userId
   * @returns
   */
  purchaseAssetDetails(assetDetailsPurchaseDTO, userId) {
    assetDetailsPurchaseDTO.expectedPurchaserId = userId;

    return this.#robloxRepository
      .purchaseAssetDetails(assetDetailsPurchaseDTO)
      .catch(({ response }) => response);
  }
}

export default RobloxService;
