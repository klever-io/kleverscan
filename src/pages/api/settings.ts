import { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.KLEVERSCAN_API_URL;
const API_KEY = process.env.KLEVERSCAN_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!API_URL) {
    console.error('Settings API error: KLEVERSCAN_API_URL is not configured');
    res
      .status(500)
      .json({ error: 'Server misconfiguration: API URL is not set' });
    return;
  }

  if (!API_KEY) {
    console.error('Settings API error: KLEVERSCAN_API_KEY is not configured');
    res
      .status(500)
      .json({ error: 'Server misconfiguration: API key is not set' });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      res.status(response.status).json({
        error: errorData.error || 'Failed to fetch settings',
        message: errorData.message || response.statusText,
      });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Settings API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
