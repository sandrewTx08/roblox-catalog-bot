import axios from "axios";
import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO";
import ItemsDetailsQueryParamsDTO from "./ItemsDetailsQueryParamsDTO";
import CatalogItemsDetailsQueryParamDTO from "./CatalogItemsDetailsQueryParamDTO";
import ProductPurchaseDTO from "./ProductPurchaseDTO";

export default class RobloxRepository {
  /**
   *
   * @param {CatalogItemsDetailsQueryParamDTO} catalogItemDetailsQueryParamDTO
   * @returns
   */
  findManyAssetDetailsByCatalogItemsDetails(catalogItemDetailsQueryParamDTO) {
    return axios("https://catalog.roblox.com/v2/search/items/details", {
      params: catalogItemDetailsQueryParamDTO,
    });
  }

  getXCsrfTokenByEmailValidation() {
    return axios.post("https://accountsettings.roblox.com/v1/email");
  }

  getAuthenticatedUser() {
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
   * @param {string[]} itemIds
   * @returns
   */
  findManyAssetDetailsByItemIds(itemIds) {
    return axios.post(
      "https://apis.roblox.com/marketplace-items/v1/items/details",
      { itemIds }
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

  /**
   *
   * @param {number} productId
   * @param {ProductPurchaseDTO} productPurchaseDTO
   * @returns
   */
  purchaseProduct(productId, productPurchaseDTO) {
    return axios.post(
      `https://economy.roblox.com/v1/purchases/products/${productId}`,
      productPurchaseDTO
    );
  }
}
