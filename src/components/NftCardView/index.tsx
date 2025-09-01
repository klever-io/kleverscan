import Link from 'next/link';
import { INfts } from '@/types';
import { parseAddress } from '@/utils/parseValues';
import { useMobile } from '@/contexts/mobile';
import Skeleton from '@/components/Skeleton';
import {
  NftImage,
  NftImageContainer,
  NftImageEmpty,
  NftImageError,
} from '@/styles/common';
import {
  NftCardContainer,
  NftCardImage,
  NftCardInfo,
  NftCardTitle,
  NftCardDetails,
  NftCardAddress,
  NftCardLink,
} from './styles';

interface NftCardViewProps {
  nft: INfts;
  nftImages: {
    [key: string]: { url: string; loading: boolean; error: boolean };
  };
  metadata: string | null;
  onImageError: (nftId: string) => void;
}

const NftCardView: React.FC<NftCardViewProps> = ({
  nft,
  nftImages,
  metadata,
  onImageError,
}) => {
  const { isMobile } = useMobile();
  const { address, assetName: collection, assetId } = nft;
  const collectionId = assetId?.split('/')[0];
  const nftId = assetId?.split('/')[1];

  const imageData = nftId ? nftImages[nftId] : null;

  return (
    <NftCardContainer>
      <NftCardImage>
        {imageData?.loading ? (
          <Skeleton width={200} height={200} />
        ) : imageData?.url ? (
          <img
            src={imageData.url}
            alt={`NFT ${nftId}`}
            onError={() => onImageError(nftId || '')}
          />
        ) : imageData?.error ? (
          <NftImageError>Error</NftImageError>
        ) : (
          <NftImageEmpty>-</NftImageEmpty>
        )}
      </NftCardImage>

      <NftCardInfo>
        <NftCardTitle>#{nftId}</NftCardTitle>
        <NftCardDetails>
          <div>
            <strong>Collection:</strong> {collection}
          </div>
          <div>
            <strong>Collection ID:</strong> {collectionId}
          </div>
        </NftCardDetails>
        <NftCardAddress>
          <Link href={`/account/${address}`} legacyBehavior>
            {isMobile ? parseAddress(address, 14) : parseAddress(address, 20)}
          </Link>
        </NftCardAddress>
        <NftCardLink>
          <Link
            href={`/account/${address}/collection/${collectionId}/${nftId}`}
          >
            View Details
          </Link>
        </NftCardLink>
      </NftCardInfo>
    </NftCardContainer>
  );
};

export default NftCardView;
