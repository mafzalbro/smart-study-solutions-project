const axios = require('axios');
const crypto = require('crypto');


exports.createJazzCashPayment = async (req, res) => {
  const { amount, description, paymentMethod, customerMobile } = req.body;

  try {
    const merchantId = process.env.JAZZCASH_MERCHANT_ID;
    const password = process.env.JAZZCASH_PASSWORD;
    const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT;
    const returnUrl = process.env.JAZZCASH_RETURN_URL;

    const txnRefNo = Date.now();
    const txnDateTime = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const expiryDateTime = new Date(Date.now() + 10 * 60000).toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

    // Select the payment method type for JazzCash
    let pp_TxnType;
    switch (paymentMethod) {
      case 'Bank':
        pp_TxnType = 'BANKACCOUNT';
        break;
      case 'Easypaisa':
        pp_TxnType = 'MWALLET';
        break;
      case 'UPaisa':
        pp_TxnType = 'MWALLET';
        break;
      default:
        pp_TxnType = 'MWALLET'; // Default to JazzCash Wallet
        break;
    }



    const hashString = `${integritySalt}&${amount * 100}&${txnDateTime}&${expiryDateTime}&${merchantId}&${txnRefNo}`;
    const secureHash = crypto.createHash('sha256').update(hashString).digest('hex').toUpperCase();

    const paymentResponse = await axios.post(process.env.JAZZCASH_API_URL, {
      pp_Version: '1.1',
      pp_TxnType,
      pp_Language: 'EN',
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amount * 100, // Amount in paisa
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: 'billRef',
      pp_Description: description,
      pp_SecureHash: secureHash,
      pp_MobileNumber: customerMobile,
      pp_ReturnURL: returnUrl,
      pp_ExpiryDateTime: expiryDateTime,
    });

    if (paymentResponse.data.pp_ResponseCode === '000') {
      return res.status(200).json({ success: true, paymentUrl: paymentResponse.data.pp_PaymentURL });
    } else {
      throw new Error(paymentResponse.data.pp_ResponseMessage);
    }
} catch (error) {
      console.error(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
