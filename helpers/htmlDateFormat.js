module.exports=function (date) {
    const dateString = date.toISOString()
    return dateString.slice(0, 10)
  }