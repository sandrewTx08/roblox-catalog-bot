import axios from "axios";
import RolimonsItemDetails from "./RolimonsItemDetails.js";
import RolimonsScraper from "./RolimonsScraper.js";

export class RolimonsService {
  findManyRolimonsItemsDetails() {
    return axios("https://www.rolimons.com/marketplace/new").then(
      ({ data }) =>
        new RolimonsItemDetails(new RolimonsScraper(data).rolimonsItemDetails())
    );
  }
}

export default RolimonsService;
