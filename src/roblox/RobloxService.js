import AssetDetailsFreePurchaseDTO from "./AssetDetailsFreePurchaseDTO";
import User from "../user/User";
import RobloxRepository from "./RobloxRepository";
import ItemsDetailsQueryParamsDTO from "./ItemsDetailsQueryParamsDTO";
import AssetDetailsQueryParamsDTO from "./AssetDetailsQueryParamsDTO";

export default class RobloxService {
  #robloxRepository;

  /**
   *
   * @param {RobloxRepository} robloxRepository
   */
  constructor(robloxRepository) {
    this.#robloxRepository = robloxRepository;
  }

  findManyCollectableAssetDetails() {
    return this.#robloxRepository
      .findManyAssetDetails(new AssetDetailsQueryParamsDTO(1, 2, 3, true, 10))
      .then(({ data }) => data);
  }

  getXCsrfToken() {
    return this.#robloxRepository
      .getXCsrfTokenByEmailValidation()
      .catch(({ response }) => response)
      .then(({ headers }) => headers["x-csrf-token"]);
  }

  getUser() {
    return this.#robloxRepository
      .getUserByXCsrfToken()
      .catch(({ response }) => response)
      .then(({ data }) => new User(data.id));
  }

  /**
   *
   * @param {ItemsDetailsQueryParamsDTO} itemsDetailsQueryParamsDTO
   * @returns
   */
  findFirstCatalogDetailByItemDetails(itemsDetailsQueryParamsDTO) {
    return this.#robloxRepository
      .findManyCatalogDetailByItemsDetails([itemsDetailsQueryParamsDTO])
      .then(
        ({
          data: {
            data: [catalogDetails],
          },
        }) => catalogDetails
      );
  }

  /**
   *
   * @param {string} collectibleItemId
   * @returns
   */
  findFirstAssetDetailsByCollectibleItemIds(collectibleItemId) {
    return this.#robloxRepository
      .findManyAssetDetailsByCollectibleItemIds([collectibleItemId])
      .then(({ data: [assetDetails] }) => assetDetails);
  }

  /**
   *
   * @param {AssetDetailsFreePurchaseDTO} assetDetailsFreePurchaseDTO
   * @param {number} userId
   * @returns
   */
  purchaseFreeAssetDetails(assetDetailsFreePurchaseDTO, userId) {
    assetDetailsFreePurchaseDTO.expectedPurchaserId = userId;

    return this.#robloxRepository
      .purchaseAssetDetails(assetDetailsFreePurchaseDTO)
      .catch(({ response }) => response);
  }
}
