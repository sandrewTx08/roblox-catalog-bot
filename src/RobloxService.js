import axios from "axios";
import AssetDetailsPurchaseDTO from "./AssetDetailsPurchaseDTO.js";
import User from "./User.js";

export class RobloxService {
  /** @type {User} */
  #user;

  constructor(ROBLOSECURITY) {
    axios.defaults.headers.common.Cookie = `.ROBLOSECURITY=${ROBLOSECURITY};`;
  }

  findManyLimitedsAssetDetails(Limit = 10) {
    return axios("https://catalog.roblox.com/v2/search/items/details", {
      params: {
        Category: 1,
        salesTypeFilter: 2,
        SortType: 3,
        IncludeNotForSale: true,
        Limit,
      },
    }).then(({ data }) => data);
  }

  setXCsrfToken() {
    return axios
      .post("https://accountsettings.roblox.com/v1/email")
      .catch(({ response }) => response)
      .then(({ headers }) => {
        axios.defaults.headers.common["x-csrf-token"] =
          headers["x-csrf-token"] ||
          axios.defaults.headers.common["x-csrf-token"] ||
          "";
      });
  }

  setUser() {
    return axios("https://users.roblox.com/v1/users/authenticated")
      .catch(({ response }) => response)
      .then(({ data }) => {
        this.#user = new User(data.id);
      });
  }

  findOneCatalogDetailByProductId(productId) {
    return axios
      .post("https://catalog.roblox.com/v1/catalog/items/details", {
        items: [{ itemType: "Asset", id: productId }],
      })
      .then(
        ({
          data: {
            data: [catalogDetails],
          },
        }) => catalogDetails
      );
  }

  findOneAssetDetailsByCollectibleItemId(collectibleItemId) {
    return axios
      .post("https://apis.roblox.com/marketplace-items/v1/items/details", {
        itemIds: [collectibleItemId],
      })
      .then(({ data: [assetDetails] }) => assetDetails);
  }

  /**
   *
   * @param {AssetDetailsPurchaseDTO} assetDetailsPurchaseDTO
   * @returns
   */
  purchaseAssetDetails(assetDetailsPurchaseDTO) {
    assetDetailsPurchaseDTO.expectedPurchaserId = this.#user.id;

    return axios
      .post(
        `https://apis.roblox.com/marketplace-sales/v1/item/${assetDetailsPurchaseDTO.collectibleItemId}/purchase-item`,
        assetDetailsPurchaseDTO
      )
      .catch(({ response }) => response);
  }
}

export default RobloxService;
