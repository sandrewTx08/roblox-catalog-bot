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

  #sortByTimestamp() {
    this.#itemDetails = Object.entries(this.#itemDetails).sort(
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

  constructor(ROBLOSECURITY) {
    axios.defaults.headers.common[
      "Cookie"
    ] = `.ROBLOSECURITY=${ROBLOSECURITY};`;
  }

  setXCsrfToken() {
    return axios
      .post("https://auth.roblox.com/v2/login")
      .catch(({ response }) => response)
      .then(({ headers }) => {
        axios.defaults.headers.common["x-csrf-token"] =
          headers["x-csrf-token"] ||
          axios.defaults.headers.common["x-csrf-token"] ||
          "";
      });
  }

  setUserInfo() {
    return axios("https://users.roblox.com/v1/users/authenticated").then(
      ({ data }) => {
        this.#userInfo = data;
      }
    );
  }

  getAssetDetailsByProductId(productId) {
    return axios
      .post("https://catalog.roblox.com/v1/catalog/items/details", {
        items: [{ itemType: "Asset", id: productId }],
      })
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
      .catch(({ response }) => response);
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

  constructor(robloxApi) {
    this.#robloxApi = robloxApi;
  }

  spamPurchaseAsset(assetDetails) {
    for (let index = 0; index < this.spamMultiplier; index++) {
      setTimeout(() => {
        this.#robloxApi.purchaseByAssetDetails(assetDetails).then(console.info);
      }, 100 * index);
    }
  }

  async snipeProduct(product) {
    if (product.price == 0) {
      await this.#robloxApi.setXCsrfToken();

      const assetDetailsByProductId =
        await this.#robloxApi.getAssetDetailsByProductId(product.id);

      if (
        assetDetailsByProductId.price == 0 &&
        assetDetailsByProductId.unitsAvailableForConsumption > 0
      ) {
        const assetDetails = await this.#robloxApi.getAssetDetailsByAssetId(
          assetDetailsByProductId.collectibleItemId
        );

        this.spamPurchaseAsset({
          collectibleItemId: assetDetailsByProductId.collectibleItemId,
          creatorTargetId: assetDetails.creatorId,
          collectibleProductId: assetDetails.collectibleProductId,
        });
      }
    }
  }

  async snipeRolimonsLastProduct() {
    const { data } = await RolimonsFetch.marketplaceNew();
    const scraper = new Scraper(data);
    const rolimonsItemDetails = new RolimonsItemDetails(scraper.itemDetails());
    const product = new Product(
      rolimonsItemDetails.itemDetails[0],
      rolimonsItemDetails.itemDetails[0][1][1]
    );

    return await this.snipeProduct(product);
  }
}
