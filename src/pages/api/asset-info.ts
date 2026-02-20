import { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.KLEVERSCAN_API_URL || '';
const API_KEY = process.env.KLEVERSCAN_API_KEY || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  // Only allow GET method
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { asset_id } = req.query;

    // Validate asset_id
    if (typeof asset_id !== 'string' || asset_id.trim() === '') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid asset identifier',
      });
      return;
    }

    const response = await fetch(
      `${API_URL}/api/v1/asset-info/asset/${encodeURIComponent(asset_id)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      res.status(response.status).json({
        error: errorData.error || 'Failed to fetch asset info',
        message: errorData.message || response.statusText,
      });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Kleverscan API error:', error);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
}
