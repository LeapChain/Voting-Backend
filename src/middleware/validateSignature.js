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
      message:
        "Signature validation failed: Please sign the message with correct private key..",
    });
  }

  next();
};

module.exports = { validateSignature };
