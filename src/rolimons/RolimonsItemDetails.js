export default class RolimonsItemDetails {
  itemDetails;

  /**
   *
   * @param {{[x: string]: any}} itemDetails
   */
  constructor(itemDetails) {
    this.itemDetails = Object.entries(itemDetails);
    this.#sortByDescTimestamp();
  }

  /**
   *
   * @param {string} timestamp
   * @returns {Date}
   */
  static formatTimestamp(timestamp) {
    const timestampArr = timestamp.split("");

    if (timestampArr.length < 13) {
      timestampArr.splice(10, 0, "0");
      timestampArr.splice(11, 0, "0");
      timestampArr.splice(12, 0, "0");

      return new Date(Number.parseInt(timestampArr.join("")));
    }

    return new Date(Number.parseInt(timestamp));
  }

  #sortByDescTimestamp() {
    this.itemDetails = this.itemDetails.sort(
      (asc, desc) => desc[1][2] - asc[1][2]
    );
  }
}
