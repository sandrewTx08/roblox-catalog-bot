export default class CatalogItemsDetailsQueryParamDTO {
  Category;
  CurrencyType;
  salesTypeFilter;
  SortType;
  IncludeNotForSale;
  Limit;
  pxMin;
  pxMax;
  SortAggregation;

  /**
   *
   * @param {number} category
   * @param {number} salesTypeFilter
   * @param {number} sortType
   * @param {boolean} includeNotForSale
   * @param {10 | 30 | 60 | 120} limit
   * @param {number} pxMin
   * @param {number} pxMax
   * @param {number} sortAggregation
   * @param {number} currencyType
   */
  constructor(
    category,
    salesTypeFilter,
    sortType,
    includeNotForSale,
    limit,
    pxMin,
    pxMax,
    sortAggregation,
    currencyType
  ) {
    this.Category = category;
    this.salesTypeFilter = salesTypeFilter;
    this.SortType = sortType;
    this.IncludeNotForSale = includeNotForSale;
    this.Limit = limit;
    this.pxMin = pxMin;
    this.pxMax = pxMax;
    this.sortAggregation = sortAggregation;
    this.CurrencyType = currencyType;
  }
}
