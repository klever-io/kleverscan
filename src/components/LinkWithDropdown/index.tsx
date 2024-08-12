import { useContractModal } from '@/contexts/contractModal';
import { useMobile } from '@/contexts/mobile';
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
  DropdownLinkContainer,
  DropdownTitle,
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
        <DropdownLinkContainer>
          <DropdownTitle>Options</DropdownTitle>
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
              <DropdownLink href={link} target="_blank">
                <MdOpenInNew size={'1.2rem'} />
                Open in New Tab
              </DropdownLink>
            </DropdownActionItem>
          </DropdownActionItemPadding>
          <Copy info="Wallet Address" data={address}>
            <DropdownActionItemPadding>
              <DropdownActionItem>
                <MdContentCopy size={'1.2rem'} />
                <p>Copy Address</p>
              </DropdownActionItem>
            </DropdownActionItemPadding>
          </Copy>
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
        </DropdownLinkContainer>
      </Dropdown>
    </LinkWrapper>
  );
};

export default LinkWithDropdown;
