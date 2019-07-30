const getCategory = require('../helpers/getCategory')
const ynabActions = require('../helpers/ynabActions')

// Syntax Examples
// Balance Inquiry: BAL Groceries >>  You have $50.41 left in your Dining Out budget.
// Enter Purchase: DEB Groceries 12.34 Wal-Mart >> You spent 12.34 on Groceries at Wal-Mart
// Enter Credit: CRED Groceries 10.00 Wal-Mart >> You got a refund on Groceries for 10.00 at Wal-Mart

smsParse = async function(req,res,next) {
  let category = req.body.body.split(' ')[1].replace('-',' ');
  let action = req.body.body.split(' ')[0]
  let amt = req.body.body.split(' ')[2]

  if (action.toLowerCase() === 'bal') {
    try {
      let data = await ynabActions.getBalance(category);
      res.message = `You have ${data.balance} left in your ${data.budget} budget.`
      next();
    } catch(e) {
      // console.log(e)
      res.status(500).send(e)
    }

  } else if (action.toLowerCase() === 'deb' || action.toLowerCase() === 'cred') {
    ynabActions.addTransaction(category,amt)
  } else {
  res.send('Error: Invalid Syntax')
  }
}

module.exports = smsParse
