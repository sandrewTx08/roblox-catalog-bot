// @ts-check

import axios from "axios";
import { randomUUID } from "crypto";

export class RolimonsFetch {
  static marketplaceNew() {
    return axios("https://www.rolimons.com/marketplace/new");
  }
}

export class RolimonsItemDetails {
  #itemDetails;

  get itemDetails() {
    return this.#itemDetails;
  }

  constructor(itemDetails) {
    this.#itemDetails = Object.entries(itemDetails);
    this.#sortByTimestamp();
  }

  static formatTimestamp(timestamp) {
    timestamp = String(timestamp).split("");

    if (timestamp.length < 13) {
      timestamp.splice(10, 0, "0");
      timestamp.splice(11, 0, "0");
      timestamp.splice(12, 0, "0");
    }

    return new Date(Number(timestamp.join("")));
  }

  #sortByTimestamp() {
    this.#itemDetails = this.#itemDetails.sort(
      (asc, desc) => desc[1][2] - asc[1][2]
    );
  }
}

export class Product {
  id;
  price;

  constructor(id, price) {
    this.id = id;
    this.price = price;
  }
}

export class RobloxAPI {
  #userInfo;

  rateLimitTimeout = 10000;

  constructor(ROBLOSECURITY) {
    axios.defaults.headers.common.Cookie = `.ROBLOSECURITY=${ROBLOSECURITY};`;
  }

  async #handleResponse(response) {
    response.data?.errors
      ? console.log(response.request.path, response.data)
      : console.log(
          response.request.path,
          response.statusText,
          response.status
        );

    await this.#handleRateLimit(response);

    return response;
  }

  async #handleRateLimit(response) {
    if (response.status == 429) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.rateLimitTimeout)
      );
    }

    return response;
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
    })
      .catch(({ response }) => response)
      .then((response) => this.#handleResponse(response))
      .then(({ data }) => data);
  }

  setXCsrfToken() {
    return axios
      .post("https://accountsettings.roblox.com/v1/email")
      .catch(({ response }) => response)
      .then((response) => this.#handleResponse(response))
      .then(({ headers }) => {
        axios.defaults.headers.common["x-csrf-token"] =
          headers["x-csrf-token"] ||
          axios.defaults.headers.common["x-csrf-token"] ||
          "";
      });
  }

  setUserInfo() {
    return axios("https://users.roblox.com/v1/users/authenticated")
      .catch(({ response }) => response)
      .then((response) => this.#handleResponse(response))
      .then(({ data }) => {
        this.#userInfo = data;
      });
  }

  findOneCatalogDetailByProductId(productId) {
    return axios
      .post("https://catalog.roblox.com/v1/catalog/items/details", {
        items: [{ itemType: "Asset", id: productId }],
      })
      .catch(({ response }) => response)
      .then((response) => this.#handleResponse(response))
      .then(
        ({
          data: {
            data: [assetDetails],
          },
        }) => assetDetails
      );
  }

  findOneAssetDetailsByCollectibleItemId(assetId) {
    return axios
      .post("https://apis.roblox.com/marketplace-items/v1/items/details", {
        itemIds: [assetId],
      })
      .catch(({ response }) => response)
      .then((response) => this.#handleResponse(response))
      .then(({ data: [assetDetails] }) => assetDetails);
  }

  purchaseByAssetDetails({
    collectibleItemId,
    creatorTargetId,
    collectibleProductId,
    expectedPrice,
  }) {
    return axios
      .post(
        `https://apis.roblox.com/marketplace-sales/v1/item/${collectibleItemId}/purchase-item`,
        {
          collectibleItemId,
          collectibleProductId,
          expectedCurrency: 1,
          expectedPrice: expectedPrice || 0,
          expectedPurchaserId: this.#userInfo.id,
          expectedPurchaserType: "User",
          expectedSellerId: creatorTargetId,
          expectedSellerType: "User",
          idempotencyKey: randomUUID(),
        }
      )
      .catch(({ response }) => response)
      .then((response) => this.#handleResponse(response));
  }
}

export class Scraper {
  #data;

  constructor(data) {
    this.#data = data;
  }

  rolimonsItemDetails() {
    return JSON.parse(this.#data.match(/var item_details = (.*);/)[1]);
  }
}

export class Bot {
  #robloxApi;

  spamMultiplier = 5;
  spamMultiplierTimeout = 0;
  checkAvailableForConsumption = false;

  constructor(robloxApi) {
    this.#robloxApi = robloxApi;
  }

  spamPurchaseAsset(purchaseAssetDetails) {
    const purchases = [
      this.#robloxApi.purchaseByAssetDetails(purchaseAssetDetails),
    ];

    for (let multiplier = 0; multiplier < this.spamMultiplier; multiplier++) {
      purchases.push(
        new Promise((resolve) => {
          setTimeout(() => {
            this.#robloxApi
              .purchaseByAssetDetails(purchaseAssetDetails)
              .finally(resolve);
          }, this.spamMultiplierTimeout * multiplier);
        })
      );
    }

    return Promise.all(purchases);
  }

  async snipeProduct(product) {
    const catalogDetail = await this.#robloxApi.findOneCatalogDetailByProductId(
      product.id
    );

    if (
      this.checkAvailableForConsumption
        ? catalogDetail.unitsAvailableForConsumption > 0
        : true
    ) {
      const assetDetails =
        await this.#robloxApi.findOneAssetDetailsByCollectibleItemId(
          catalogDetail.collectibleItemId
        );

      return this.spamPurchaseAsset({
        collectibleItemId: catalogDetail.collectibleItemId,
        creatorTargetId: assetDetails.creatorId,
        collectibleProductId: assetDetails.collectibleProductId,
        expectedPrice: 0,
      });
    }
  }

  async snipeCatalogDetails(catalogDetails) {
    if (
      this.checkAvailableForConsumption
        ? catalogDetails.unitsAvailableForConsumption > 0
        : true
    ) {
      const assetDetails =
        await this.#robloxApi.findOneAssetDetailsByCollectibleItemId(
          catalogDetails.collectibleItemId
        );

      return this.spamPurchaseAsset({
        collectibleItemId: catalogDetails.collectibleItemId,
        creatorTargetId: catalogDetails.creatorTargetId,
        collectibleProductId: assetDetails.collectibleProductId,
        expectedPrice: 0,
      });
    }
  }

  async snipeRolimonsLastProduct(ignoreProductsAfter = 30000) {
    const { data } = await RolimonsFetch.marketplaceNew();
    const scraper = new Scraper(data);
    const rolimonsItemDetails = new RolimonsItemDetails(
      scraper.rolimonsItemDetails()
    );

    const product = new Product(
      rolimonsItemDetails.itemDetails[0][0],
      rolimonsItemDetails.itemDetails[0][1][1]
    );

    if (
      product.price == 0 &&
      RolimonsItemDetails.formatTimestamp(
        rolimonsItemDetails.itemDetails[0][1][2]
      ).getTime() +
        ignoreProductsAfter >
        new Date().getTime()
    )
      return this.snipeProduct(product);
  }

  async snipeRobloxApiLastProduct() {
    const {
      data: [catalogDetails],
    } = await this.#robloxApi.findManyLimitedsAssetDetails();

    if (catalogDetails.price == 0)
      return this.snipeCatalogDetails(catalogDetails);
  }
}
