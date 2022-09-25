const { verifySignature } = require("@leapchain/dleap");

const validateSignature = (req, res, next) => {
  const stringifiedMessage = JSON.stringify(req.body.message);

  const isValidSignature = verifySignature(
    req.body.signature,
    stringifiedMessage,
    req.body.accountNumber
  );

  if (!isValidSignature) {
    return res.status(401).json({
      message: "Invalid signature.",
    });
  }

  next();
};

module.exports = { validateSignature };
