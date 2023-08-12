import Scraper from "./../Scraper";

export default class RolimonsScraper extends Scraper {
  /**
   *
   * @param {string} data
   */
  constructor(data) {
    super(data);
  }

  rolimonsItemDetails() {
    return JSON.parse(this.data.match(/var item_details = (.*);/)?.at(1) || "");
  }
}
