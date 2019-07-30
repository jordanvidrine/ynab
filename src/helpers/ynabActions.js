require('dotenv').config()
const ynab = require('ynab');
const ynabAPI = new ynab.API(process.env.YNAB_ACCESS_TOKEN)
const getCategory = require('./getCategory')

module.exports = {
  async getBalance(category) {
    try {
      let categoryData = await this.getCategoryData(category)
      let balance = `$` + ynab.utils.convertMilliUnitsToCurrencyAmount(categoryData.balance,2);
      // add trailing 0 to any number with one decimal place
      if (balance.includes('.') && balance.split('.')[1].length < 2) { balance = balance+'0'; }
      let budget = categoryData.name;
      return { balance , budget }
    } catch(e) {
      throw new Error('Couldn\'t find that budget!')
    }
  },

  async addTransaction(category,amt) {

    console.log(amt);
  },

  async getCategoryData(category) {
    console.log(category)
    try {
      let categoriesData = await ynabAPI.categories.getCategories(process.env.TEST_BUDGET_ID);
      // I perform this filter because the API returns an internal master list that doesnt seem necessary to my app
      let filteredData = categoriesData.data.category_groups.filter(cat => cat["name"] !== "Internal Master Category");
      let categoryData = getCategory(filteredData, category)
      return categoryData;
    } catch(e) {
      throw new Error('Couldn\'t find that budget!')
    }
  }
}
