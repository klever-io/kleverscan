import { queryDirectus } from '@/services/directus';
import { readItem } from '@directus/sdk';
import { NextApiRequest, NextApiResponse } from 'next';

// Allowed collections for read-only access
const ALLOWED_COLLECTIONS = ['asset_info'];

// Allowed fields per collection
const ALLOWED_FIELDS: Record<string, string[]> = {
  asset_info: [
    'short_description',
    'project_description',
    'project_description_copy',
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  // Only allow POST method
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { requestFunction, requestParams } = req.body;

    // Only allow readItem function
    if (requestFunction !== 'readItem') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only read operations are allowed',
      });
      return;
    }

    // Validate requestParams structure
    if (!Array.isArray(requestParams) || requestParams.length < 2) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid request parameters',
      });
      return;
    }

    const [collection, itemId] = requestParams;

    // Validate collection is in allowlist
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access to this collection is not allowed',
      });
      return;
    }

    // Validate itemId is a non-empty string
    if (typeof itemId !== 'string' || itemId.trim() === '') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid item identifier',
      });
      return;
    }

    // Restrict fields to allowed fields only
    const allowedFieldsForCollection = ALLOWED_FIELDS[collection] || [];
    const safeOptions = {
      fields: allowedFieldsForCollection,
    };

    const client = queryDirectus();

    const response = await client.request(
      readItem(collection, itemId, safeOptions),
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Directus API error:', error);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
}
