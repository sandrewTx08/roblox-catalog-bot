import axios from "axios";
import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO";
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

  getUser() {
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
   * @param {AssetDetailsPurchaseDTO} assetDetailsPurchaseDTO
   * @returns
   */
  purchaseAssetDetails(assetDetailsPurchaseDTO) {
    return axios.post(
      `https://apis.roblox.com/marketplace-sales/v1/item/${assetDetailsPurchaseDTO.collectibleItemId}/purchase-item`,
      assetDetailsPurchaseDTO
    );
  }
}
