import axios from "axios";

export class RolimonsService {
  static marketplaceNew() {
    return axios("https://www.rolimons.com/marketplace/new");
  }
}

export default RolimonsService;
