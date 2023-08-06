import axios from "axios";
import AssetDetailsFreePurchaseDTO from "./AssetDetailsFreePurchaseDTO";
import ItemsDetailsQueryParamsDTO from "./ItemsDetailsQueryParamsDTO";
import AssetDetailsQueryParamsDTO from "./AssetDetailsQueryParamsDTO";

export default class RobloxRepository {
  /**
   *
   * @param {AssetDetailsQueryParamsDTO} assetDetailsQueryParamsDTO
   * @returns
   */
  findManyAssetDetails(assetDetailsQueryParamsDTO) {
    return axios("https://catalog.roblox.com/v2/search/items/details", {
      params: assetDetailsQueryParamsDTO,
    });
  }

  getXCsrfTokenByEmailValidation() {
    return axios.post("https://accountsettings.roblox.com/v1/email");
  }

  getUserByXCsrfToken() {
    return axios("https://users.roblox.com/v1/users/authenticated");
  }

  /**
   *
   * @param {ItemsDetailsQueryParamsDTO[]} itemsDetailsQueryParamsDTO
   * @returns
   */
  findManyCatalogDetailByItemsDetails(itemsDetailsQueryParamsDTO) {
    return axios.post("https://catalog.roblox.com/v1/catalog/items/details", {
      items: itemsDetailsQueryParamsDTO,
    });
  }

  /**
   *
   * @param {string[]} collectibleItemIds
   * @returns
   */
  findManyAssetDetailsByCollectibleItemIds(collectibleItemIds) {
    return axios.post(
      "https://apis.roblox.com/marketplace-items/v1/items/details",
      { itemIds: collectibleItemIds }
    );
  }

  /**
   *
   * @param {AssetDetailsFreePurchaseDTO} assetDetailsFreePurchaseDTO
   * @returns
   */
  purchaseAssetDetails(assetDetailsFreePurchaseDTO) {
    return axios.post(
      `https://apis.roblox.com/marketplace-sales/v1/item/${assetDetailsFreePurchaseDTO.collectibleItemId}/purchase-item`,
      assetDetailsFreePurchaseDTO
    );
  }
}
