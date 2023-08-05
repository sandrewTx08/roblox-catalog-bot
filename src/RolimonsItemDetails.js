export class RolimonsItemDetails {
  #itemDetails;

  get itemDetails() {
    return this.#itemDetails;
  }

  constructor(itemDetails) {
    this.#itemDetails = Object.entries(itemDetails);
    this.#sortByTimestamp();
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
    }

    return new Date(Number(timestampArr.join("")));
  }

  #sortByTimestamp() {
    this.#itemDetails = this.#itemDetails.sort(
      (asc, desc) => desc[1][2] - asc[1][2]
    );
  }
}

export default RolimonsItemDetails;
