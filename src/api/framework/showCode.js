const showCode = (req, res) => {
  const { code } = req.query

  res.render('showCode', { code })
}

module.exports = showCode
