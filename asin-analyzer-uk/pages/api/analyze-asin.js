
import axios from 'axios';

const KEEPA_API_KEY = process.env.KEEPA_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { asin } = req.body;

  if (!asin) {
    return res.status(400).json({ message: 'ASIN is required' });
  }

  try {
    const keepaResponse = await axios.get(`https://api.keepa.com/product`, {
      params: {
        key: KEEPA_API_KEY,
        domain: 3,  // Amazon UK
        asin: asin,
        history: 1,
      },
    });

    const product = keepaResponse.data.products[0];

    if (!product) {
      return res.status(404).json({ message: 'Product not found on Keepa' });
    }

    const sellerCounts = product.sellerCount || [];
    const latestSellerCount = sellerCounts[sellerCounts.length - 1] || 0;
    const avgSellerCount = sellerCounts.length > 0
      ? Math.round(sellerCounts.reduce((sum, val) => sum + val, 0) / sellerCounts.length)
      : 0;

    let score = 5;
    if (latestSellerCount <= 3) score = 9;
    else if (latestSellerCount <= 7) score = 7;
    else if (latestSellerCount <= 15) score = 5;
    else score = 2;

    res.status(200).json({
      asin: asin,
      title: product.title,
      brand: product.brand,
      latestSellerCount,
      avgSellerCount,
      score,
      message: score >= 7 ? 'Great opportunity!' : score >= 5 ? 'Average competition' : 'High competition',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
