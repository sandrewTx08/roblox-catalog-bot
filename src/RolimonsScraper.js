import Scraper from "./Scraper.js";

export class RolimonsScraper extends Scraper {
  constructor(data) {
    super(data);
  }

  rolimonsItemDetails() {
    return JSON.parse(this.data.match(/var item_details = (.*);/)?.at(1) || "");
  }
}

export default RolimonsScraper;
