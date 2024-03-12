import {
  createDirectus,
  DirectusClient,
  rest,
  RestClient,
  staticToken,
  StaticTokenClient,
} from '@directus/sdk';

export const queryDirectus = (): DirectusClient<any> &
  RestClient<any> &
  StaticTokenClient<any> => {
  return createDirectus(process.env.DEFAULT_CDN_HOST || 'https://cdn.klever.io')
    .with(rest())
    .with(staticToken(process.env.DIRECTUS_STATIC_TOKEN || ''));
};
