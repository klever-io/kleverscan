import AssetLogo from '@/components/Logo/AssetLogo';
import React from 'react';
import { AssetIdLine, AssetName, IdentityLink, IdentityText } from './styles';

interface IAssetIdentityProps {
  href: string;
  /** The e2e suite clicks a row through this, so it stays per-table. */
  testId: string;
  name: string;
  assetId: string;
  ticker: string;
  logo: string;
  verified?: boolean;
}

/**
 * Logo, name and id for one asset. Shared between a table's desktop row and
 * its mobile card: they showed the same thing through two copies of this
 * markup, which is exactly how the two drift apart when one of them gains an
 * attribute the other does not.
 */
const AssetIdentity: React.FC<IAssetIdentityProps> = ({
  href,
  testId,
  name,
  assetId,
  ticker,
  logo,
  verified,
}) => (
  <IdentityLink href={href} data-testid={testId} title={name}>
    <AssetLogo
      logo={logo}
      ticker={ticker}
      name={name}
      verified={verified}
      size={32}
    />
    <IdentityText>
      <AssetName>{name}</AssetName>
      <AssetIdLine>{assetId}</AssetIdLine>
    </IdentityText>
  </IdentityLink>
);

export default AssetIdentity;
