const getCategory = require('../helpers/getCategory')
const ynabActions = require('../helpers/ynabActions')

// Syntax Examples
// Balance Inquiry: Groceries >>  You have $50.41 left in your Dining Out budget.
// Enter Purchase: Groceries -12.34 Wal-Mart >> Your transaction with Wal Mart in the amount of $-12.34 was successfully entered.
// Enter Credit: Groceries 10.00 Wal-Mart >> Your transaction with Wal Mart in the amount of $10.00 was successfully entered.

smsParse = async function(req,res,next) {
  let numOfArgs = req.body.Body.split(' ').length;

  // checks if arguments exist
  if (numOfArgs) {
    let category = req.body.Body.split(' ')[0].replace('-',' ');

    // Only passing in one argument retrieves the balance of that argument/category
    if (numOfArgs === 1) {
      try {
        let data = await ynabActions.getBalance(category);
        // saves the response to res.message to be passed back to the user
        res.message = `You have ${data.balance} left in your ${data.budget} budget.`
        next();
      } catch(e) {
        next(e);
      }

    // To Cred or Deb an acct, 3 arguments must be passed
    } else if (numOfArgs === 3) {
      let args = [...req.body.Body.split(' ')]
      let cat = args[0].replace('-',' ');

      // converting amt to miliunits (number passed MUST in have two decimal places >> 2.33, -23.45)
      args[1] = args[1].replace('.','') + '0'
      let amt = Number(args[1]);
      let payee = args[2].replace('-',' ');

      // checks the argument types, must be correct to continue on
      if (typeof cat === 'string' && typeof amt === 'number' && typeof payee === 'string') {
        try {
          let transactionData = await ynabActions.addTransaction(category,amt,payee)
          // saves the response to res.message to be passed back to the user
          res.message = transactionData.successMsg;

          next()
        } catch(e) {
          next(e);
        }
      }
    } else {
      // Syntax Error Message
      res.status(500).send({Error:'Syntax Error!\nFor Balance Inquiry >> Category \n For Purchase >> Category, -Purchase Amt, Payee\n For Refund >> Category, Refund Amt, Payee' });
    }
  }
}

module.exports = smsParse
