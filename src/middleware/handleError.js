function handleError(err,req,res,next) {
  res.send({error:err.message, type: err.name})
}

module.exports = handleError;
