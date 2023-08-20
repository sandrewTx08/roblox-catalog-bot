import Scraper from "./../Scraper";

export default class RolimonsScraper extends Scraper {
  /**
   *
   * @param {string} data
   */
  constructor(data) {
    super(data);
  }

  /**
   *
   * @returns {{[x: string]: any}}
   */
  marketPlaceItemsDetails() {
    return JSON.parse(this.data.match(/var item_details = (.*);/)?.at(1) || "");
  }
}
