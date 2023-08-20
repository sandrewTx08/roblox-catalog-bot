export default class ProductPurchaseDTO {
  expectedCurrency;
  expectedPrice;
  expectedSellerId;

  /**
   *
   * @param {number} expectedCurrency
   * @param {number} expectedPrice
   * @param {number} expectedSellerId
   */
  constructor(expectedCurrency, expectedPrice, expectedSellerId) {
    this.expectedCurrency = expectedCurrency;
    this.expectedPrice = expectedPrice;
    this.expectedSellerId = expectedSellerId;
  }
}
