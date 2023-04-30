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
    this.#itemDetails = itemDetails;
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
    this.#itemDetails = Object.entries(this.#itemDetails).sort(
      (asc, desc) => desc[1][2] - asc[1][2]
    );
  }
}

export class Product {
  id;
  price;
  timestamp;

  constructor(id, price, timestamp) {
    this.id = id;
    this.price = price;
    this.timestamp = timestamp;
  }
}

export class RobloxAPI {
  #userInfo;

  rateLimitTimeout = 10000;

  constructor(ROBLOSECURITY) {
    axios.defaults.headers.common[
      "Cookie"
    ] = `.ROBLOSECURITY=${ROBLOSECURITY};`;
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

  getAssetDetailsByProductId(productId) {
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

  getAssetDetailsByAssetId(assetId) {
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
  }) {
    return axios
      .post(
        `https://apis.roblox.com/marketplace-sales/v1/item/${collectibleItemId}/purchase-item`,
        {
          collectibleProductId,
          collectibleItemId,
          expectedCurrency: 1,
          expectedPrice: 0,
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

  itemDetails() {
    return JSON.parse(this.#data.match(/var item_details = (.*);/)[1]);
  }
}

export class Bot {
  #robloxApi;

  spamMultiplier = 5;
  ignoreProductsAfter = 120000;

  constructor(robloxApi) {
    this.#robloxApi = robloxApi;
  }

  spamPurchaseAsset(assetDetails) {
    const promises = [this.#robloxApi.purchaseByAssetDetails(assetDetails)];

    for (let index = 0; index < this.spamMultiplier; index++) {
      promises.push(
        new Promise((resolve) => {
          setTimeout(() => {
            this.#robloxApi
              .purchaseByAssetDetails(assetDetails)
              .finally(resolve);
          }, 100 * index);
        })
      );
    }

    return Promise.all(promises);
  }

  async snipeProduct(product) {
    const assetDetailsByProductId =
      await this.#robloxApi.getAssetDetailsByProductId(product.id);

    if (assetDetailsByProductId.unitsAvailableForConsumption > 0) {
      const assetDetails = await this.#robloxApi.getAssetDetailsByAssetId(
        assetDetailsByProductId.collectibleItemId
      );

      return this.spamPurchaseAsset({
        collectibleItemId: assetDetailsByProductId.collectibleItemId,
        creatorTargetId: assetDetails.creatorId,
        collectibleProductId: assetDetails.collectibleProductId,
      });
    }
  }

  async snipeRolimonsLastProduct() {
    const { data } = await RolimonsFetch.marketplaceNew();
    const scraper = new Scraper(data);
    const rolimonsItemDetails = new RolimonsItemDetails(scraper.itemDetails());

    const product = new Product(
      rolimonsItemDetails.itemDetails[0][0],
      rolimonsItemDetails.itemDetails[0][1][1],
      RolimonsItemDetails.formatTimestamp(
        rolimonsItemDetails.itemDetails[0][1][2]
      )
    );

    if (
      product.price == 0 &&
      product.timestamp.getTime() + this.ignoreProductsAfter >
        new Date().getTime()
    )
      return this.snipeProduct(product);
  }
}
