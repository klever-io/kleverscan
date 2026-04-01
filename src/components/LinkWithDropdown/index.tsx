import { useContractModal } from '@/contexts/contractModal';
import { useMobile } from '@/contexts/mobile';
import { useTheme } from '@/contexts/theme';
import { QRCodeSVG } from 'qrcode.react';
import React, { ReactNode, useState } from 'react';
import {
  MdContentCopy,
  MdOpenInBrowser,
  MdOpenInNew,
  MdQrCode,
} from 'react-icons/md';
import Copy from '../Copy';
import {
  Dropdown,
  DropdownActionItem,
  DropdownActionItemPadding,
  DropdownLink,
  LinkWrapper,
  QrCodeDropdown,
  QrCodeDropdownContainer,
  QrCodeTitle,
} from './styles';

interface LinkWithDropdownProps {
  children: ReactNode;
  link: string;
  address: string;
}

const LinkWithDropdown: React.FC<LinkWithDropdownProps> = ({
  children,
  link,
  address,
}) => {
  const { isMobile } = useMobile();
  const [qrCodeDropDown, setQrCodeDropDown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme } = useTheme();
  const { getInteractionsButtons } = useContractModal();
  const [TransferButton] = getInteractionsButtons([
    {
      title: 'Transfer',
      contractType: 'TransferContract',
      buttonStyle: 'contextModal',
      defaultValues: {
        receiver: address,
      },
    },
  ]);

  const handleMouseEnterDropdown = () => {
    setShowDropdown(true);
  };

  const handleMouseLeaveDropdown = () => {
    setShowDropdown(false);
    setQrCodeDropDown(false);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowDropdown(old => !old);
  };

  return (
    <LinkWrapper
      onMouseEnter={!isMobile ? handleMouseEnterDropdown : undefined}
      onMouseLeave={handleMouseLeaveDropdown}
      onContextMenu={handleContextMenu}
    >
      <div onClick={isMobile ? handleContextMenu : undefined}>{children}</div>
      <Dropdown show={showDropdown}>
        {isMobile && (
          <DropdownActionItemPadding>
            <DropdownActionItem>
              <DropdownLink href={link}>
                <MdOpenInBrowser size={'1.2rem'} />
                Open
              </DropdownLink>
            </DropdownActionItem>
          </DropdownActionItemPadding>
        )}
        <DropdownActionItemPadding>
          <DropdownActionItem>
            <DropdownLink href={link} target="_blank" rel="noopener noreferrer">
              <MdOpenInNew size={'1.2rem'} />
              Open in New Tab
            </DropdownLink>
          </DropdownActionItem>
        </DropdownActionItemPadding>
        <DropdownActionItemPadding>
          <Copy
            info="Wallet Address"
            data={address}
            color={theme.black}
            style={{ width: '100%' }}
          >
            <DropdownActionItem>
              <MdContentCopy size={'1.2rem'} />
              <p>Copy Address</p>
            </DropdownActionItem>
          </Copy>
        </DropdownActionItemPadding>
        <DropdownActionItemPadding>
          <DropdownActionItem
            onClick={() => {
              setQrCodeDropDown(old => !old);
            }}
          >
            <MdQrCode size={'1.2rem'} />
            QR Code
            <QrCodeDropdown active={qrCodeDropDown}>
              <QrCodeDropdownContainer>
                <QrCodeTitle>View QR code</QrCodeTitle>
                <div>
                  <QRCodeSVG height={165} width={165} value={address} />
                </div>
              </QrCodeDropdownContainer>
            </QrCodeDropdown>
          </DropdownActionItem>
        </DropdownActionItemPadding>
        <DropdownActionItemPadding>
          <TransferButton />
        </DropdownActionItemPadding>
      </Dropdown>
    </LinkWrapper>
  );
};

export default LinkWithDropdown;
