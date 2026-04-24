function validateScoreInput(req, res, next) {
  const { paymentHistory, creditUtilization, accountAge, totalAccounts, recentInquiries } = req.body;

  if (
    paymentHistory === undefined ||
    creditUtilization === undefined ||
    accountAge === undefined ||
    totalAccounts === undefined ||
    recentInquiries === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (paymentHistory < 0 || paymentHistory > 100) {
    return res.status(400).json({ message: "Payment history must be 0-100" });
  }

  if (creditUtilization < 0 || creditUtilization > 100) {
    return res.status(400).json({ message: "Credit utilization must be 0-100" });
  }

  if (accountAge < 0 || accountAge > 10) {
    return res.status(400).json({ message: "Account age must be 0-10 years" });
  }

  if (totalAccounts < 0 || totalAccounts > 20) {
    return res.status(400).json({ message: "Total accounts must be 0-20" });
  }

  if (recentInquiries < 0 || recentInquiries > 10) {
    return res.status(400).json({ message: "Recent inquiries must be 0-10" });
  }

  next();
}

module.exports = validateScoreInput;
