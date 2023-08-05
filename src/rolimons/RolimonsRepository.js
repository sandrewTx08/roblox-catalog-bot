import axios from "axios";

export class RolimonsRespository {
  findManyRolimonsItemsDetails() {
    return axios("https://www.rolimons.com/marketplace/new");
  }
}

export default RolimonsRespository;
