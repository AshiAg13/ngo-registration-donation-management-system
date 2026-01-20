import crypto from "crypto";
import Donation from "../models/Donation.js";

/**
 * 1. HASH GENERATION FOR FRONTEND
 * Creates the initial signature to authorize the checkout
 */
export const generatePayHereHash = (req, res) => {
  try {
    const { order_id, amount, currency } = req.body;
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantId || !merchantSecret) {
      console.error("Missing PayHere credentials in environment variables");
      return res.status(500).json({ message: "Gateway configuration error" });
    }

    // PayHere requires MD5(MerchantSecret) in Uppercase
    const secretHash = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    // Generate authorization hash
    const hash = crypto
      .createHash("md5")
      .update(merchantId + order_id + amount + currency + secretHash)
      .digest("hex")
      .toUpperCase();

    res.status(200).json({ merchant_id: merchantId, hash });
  } catch (error) {
    res.status(500).json({ message: "Hash generation failed" });
  }
};

/**
 * 2. PAYHERE NOTIFICATION (WEBHOOK)
 * Listens for server-to-server updates from PayHere
 */
export const payHereNotify = async (req, res) => {
  // Extracting from req.body (PayHere sends form-data)
  const { 
    merchant_id, 
    order_id, 
    payhere_amount, 
    payhere_currency, 
    status_code, 
    md5sig 
  } = req.body;

  try {
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const hashedSecret = crypto.createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();
    
    // PayHere amount is a string (e.g., "100.00"). 
    // We format it strictly to match their hashing algorithm.
    const amountFormatted = parseFloat(payhere_amount).toFixed(2);
    
    // Re-create the hash locally to compare with PayHere's signature
    const localMd5Sig = crypto.createHash("md5")
      .update(merchant_id + order_id + amountFormatted + payhere_currency + status_code + hashedSecret)
      .digest("hex")
      .toUpperCase();

    // 🛡️ SECURITY CHECK
    if (localMd5Sig !== md5sig) {
      console.warn(`🛑 Unauthorized PayHere attempt! Order: ${order_id}`);
      return res.status(401).send("Invalid Signature");
    }

    const donation = await Donation.findById(order_id);
    if (!donation) {
      return res.status(404).send("Donation record not found");
    }

    // Avoid updating if already marked SUCCESS
    if (donation.status === "SUCCESS") {
      return res.status(200).send("OK");
    }

    // Map PayHere status codes to our DB statuses
    // 2 = Success, 0 = Pending, -1 = Canceled, -2 = Failed, -3 = Chargedback
    switch (status_code) {
      case "2":
        donation.status = "SUCCESS";
        break;
      case "0":
        donation.status = "PENDING";
        break;
      case "-1":
        donation.status = "CANCELED";
        break;
      case "-2":
      case "-3":
        donation.status = "FAILED";
        break;
      default:
        donation.status = "FAILED";
    }

    await donation.save();
    console.log(`💳 Payment Status Updated: ${order_id} -> ${donation.status}`);
    
    // 📢 Essential: Return 200 OK so PayHere stops retrying the webhook
    res.status(200).send("OK");

  } catch (err) {
    console.error("❌ PayHere Webhook Error:", err);
    res.status(500).send("Internal Error");
  }
};