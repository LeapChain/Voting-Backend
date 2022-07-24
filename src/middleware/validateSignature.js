const { verifySignature } = require("@leapchain/dleap");

const validateSignature = (req, res, next) => {
  const stringifiedMessage = JSON.stringify(req.body.message);

  const isValidSignature = verifySignature(
    req.body.signature,
    stringifiedMessage,
    req.body.accountNumber
  );

  if (!isValidSignature) {
    return res.status(400).json({
      error: "Invalid Signature..",
    });
  }

  next();
};

module.exports = { validateSignature };
