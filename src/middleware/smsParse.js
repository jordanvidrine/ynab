const getCategory = require('../helpers/getCategory')
const ynabActions = require('../helpers/ynabActions')

// Syntax Examples
// Balance Inquiry: BAL Groceries >>  You have $50.41 left in your Dining Out budget.
// Enter Purchase: DEB Groceries 12.34 Wal-Mart >> You spent 12.34 on Groceries at Wal-Mart
// Enter Credit: CRED Groceries 10.00 Wal-Mart >> You got a refund on Groceries for 10.00 at Wal-Mart

smsParse = async function(req,res,next) {
  let category = req.body.body.split(' ')[1].replace('-',' ');
  let action = req.body.body.split(' ')[0]

  if (action.toLowerCase() === 'bal') {
    try {
      let data = await ynabActions.getBalance(category);
      req.balance = data.balance;
      req.budget = data.budget;
      next();
    } catch(e) {
      console.log(e)
      res.status(500).send('Couldnt get the balance.')
    }

  } else if (action.toLowerCase() === 'deb') {
    res.send(`Perform Debit Task on ${category}`)
  } else if (action.toLowerCase() === 'cred') {
    res.send(`Perform Credit Task on ${category}`)
  }

  else {
  res.send('Error: Invalid Syntax')
  }
}

module.exports = smsParse
