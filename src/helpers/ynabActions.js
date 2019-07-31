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
      throw(e)
    }
  },

  async addTransaction(category,amt,payee) {
    try {
      let categoryData = await this.getCategoryData(category);
      if (!categoryData) {
        throw new Error('Category not found!')
      }
      // Search to see if payee already exists in the payee database
      let payeesData = await this.getPayee(payee)
      let payee_name;
      // If payee does exist, set payee_name to match name in database so a new payee is not created
      if (payeesData !== undefined) {
        payee_name = payeesData.name;
      // if payee does not exist in database, set the payee name to the one entered
      } else if (payeesData === undefined) {
        payee_name = payee;
      }

      // define transaction object to pass to the ynab api
      let transaction = {
        account_id: process.env.FAKE_BANK_ID,
        amount: amt,
        date: ynab.utils.getCurrentDateInISOFormat(),
        payee_id: null,
        payee_name: payee_name,
        category_id: categoryData.id,
        cleared: null,
        approved: true,
        memo: null,
      };

      let transactionData = await ynabAPI.transactions.createTransaction(process.env.TEST_BUDGET_ID, {transaction});

      return {transactionData, successMsg: `Your transaction with ${transactionData.data.transaction.payee_name} in the amount of ${`$` + ynab.utils.convertMilliUnitsToCurrencyAmount(transactionData.data.transaction.amount,2)} was successfully entered in the ${categoryData.name} category.`};

    } catch(e) {
      // create custom error based on the returned error from the YNAB api
      if (e.error) {
        throw new Error(`${e.error.name}: ${e.error.detail}`)
      }
      throw(e)
    }
  },

  async getCategoryData(category) {
    try {
      let categoriesData = await ynabAPI.categories.getCategories(process.env.TEST_BUDGET_ID);
      // I perform this filter because the API returns an internal master list that doesnt seem necessary to my app
      let filteredData = categoriesData.data.category_groups.filter(cat => cat["name"] !== "Internal Master Category");
      let categoryData = getCategory(filteredData, category)
      return categoryData;
    } catch(e) {
      throw(e)
    }
  },

  async getPayee(payee) {
    try {
      let payees = await ynabAPI.payees.getPayees(process.env.TEST_BUDGET_ID);
      let foundPayee = payees.data.payees.find(item => {return item.name.toLowerCase() === payee.toLowerCase()})
      return foundPayee;
    } catch(e) {
      throw(e)
    }
  }
}
