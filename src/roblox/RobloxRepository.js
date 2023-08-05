import axios from "axios";
import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO.js";

export class RobloxRepository {
  findManyLimitedsAssetDetails(params = {}) {
    return axios("https://catalog.roblox.com/v2/search/items/details", {
      params,
    });
  }

  getXCsrfToken() {
    return axios.post("https://accountsettings.roblox.com/v1/email");
  }

  getUserByEmailSignInValidation() {
    return axios("https://users.roblox.com/v1/users/authenticated");
  }

  findOneCatalogDetailByProductId(productId) {
    return axios.post("https://catalog.roblox.com/v1/catalog/items/details", {
      items: [{ itemType: "Asset", id: productId }],
    });
  }

  findOneAssetDetailsByCollectibleItemId(collectibleItemId) {
    return axios.post(
      "https://apis.roblox.com/marketplace-items/v1/items/details",
      { itemIds: [collectibleItemId] }
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

export default RobloxRepository;
