import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO";
import User from "../user/User";
import RobloxRepository from "./RobloxRepository";
import ItemsDetailsQueryParamsDTO from "./ItemsDetailsQueryParamsDTO";
import CatalogItemsDetailsQueryParamDTO from "./CatalogItemsDetailsQueryParamDTO";
import ProductPurchaseDTO from "./ProductPurchaseDTO";

export default class RobloxService {
  #robloxRepository;

  /**
   *
   * @param {RobloxRepository} robloxRepository
   */
  constructor(robloxRepository) {
    this.#robloxRepository = robloxRepository;
  }

  findManyCollectableAssetDetails(maxPrice = 0) {
    return this.#robloxRepository
      .findManyAssetDetailsByCatalogItemsDetails(
        new CatalogItemsDetailsQueryParamDTO(
          1,
          2,
          3,
          true,
          120,
          0,
          maxPrice,
          1,
          3
        )
      )
      .then(({ data: { data: assetsDetails } }) => assetsDetails);
  }

  findManyFreeProductsAssetDetails() {
    return this.#robloxRepository
      .findManyAssetDetailsByCatalogItemsDetails(
        new CatalogItemsDetailsQueryParamDTO(1, 2, 3, true, 120, 0, 0, 1, 3)
      )
      .then(({ data: { data: assetsDetails } }) => assetsDetails);
  }

  getXCsrfToken() {
    return this.#robloxRepository
      .getXCsrfTokenByEmailValidation()
      .catch(({ response }) => response)
      .then(({ headers }) => headers["x-csrf-token"]);
  }

  getUser() {
    return this.#robloxRepository
      .getAuthenticatedUser()
      .then(({ data }) => new User(data.id));
  }

  /**
   *
   * @param {ItemsDetailsQueryParamsDTO[]} itemsDetailsQueryParamsDTO
   * @returns
   */
  findManyCatalogDetailByItemsDetails(itemsDetailsQueryParamsDTO) {
    return this.#robloxRepository
      .findManyCatalogDetailByItemsDetails(itemsDetailsQueryParamsDTO)
      .then(({ data: { data: itemsDetails } }) => itemsDetails);
  }

  /**
   *
   * @param {string[]} itemsIds
   * @returns
   */
  findManyAssetDetailsByItemIds(itemsIds) {
    return this.#robloxRepository
      .findManyAssetDetailsByItemIds(itemsIds)
      .then(({ data }) => data);
  }

  /**
   *
   * @param {AssetDetailsPurchaseDTO} assetDetailsPurchaseDTO
   * @returns
   */
  purchaseAssetDetails(assetDetailsPurchaseDTO) {
    return this.#robloxRepository.purchaseAssetDetails(assetDetailsPurchaseDTO);
  }

  /**
   *
   * @param {number} productId
   * @param {ProductPurchaseDTO} purchaseProductDTO
   * @returns
   */
  purchaseProduct(productId, purchaseProductDTO) {
    return this.#robloxRepository.purchaseProduct(
      productId,
      purchaseProductDTO
    );
  }
}
