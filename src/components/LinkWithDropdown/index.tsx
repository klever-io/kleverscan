import { useContractModal } from '@/contexts/contractModal';
import { useMobile } from '@/contexts/mobile';
import { useTheme } from '@/contexts/theme';
import { QRCodeSVG } from 'qrcode.react';
import React, { ReactNode, useMemo, useState } from 'react';
import {
  MdContentCopy,
  MdOpenInBrowser,
  MdOpenInNew,
  MdQrCode,
} from 'react-icons/md';
import Copy from '../Copy';
import { LinkEntity, menuForEntity } from './menu';
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
  /**
   * What the link points at, which decides what the menu offers and what the
   * copy action is called. Defaults to an account: the direct consumers wrap
   * sender and receiver addresses.
   */
  entity?: LinkEntity;
}

const LinkWithDropdown: React.FC<LinkWithDropdownProps> = ({
  children,
  link,
  address,
  entity = 'account',
}) => {
  const menu = menuForEntity(entity);
  const { isMobile } = useMobile();
  const [qrCodeDropDown, setQrCodeDropDown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  /**
   * The menu below was built for every link on the page and then hidden with
   * CSS, QR code included. A transactions list puts three or four of these in
   * each of its ten rows, so a page rendered dozens of QR codes nobody had
   * asked to see. It is built while it is open and torn down after, which caps
   * the cost at one menu instead of letting a pointer sweep across a column
   * mount every one of them for the rest of the visit.
   */
  const { theme } = useTheme();
  const { getInteractionsButtons } = useContractModal();
  // Memoised because the factory returns a freshly built component type on
  // every call: without this the button is a different type each render, so
  // React tears its node down and rebuilds it instead of updating it.
  const [TransferButton] = useMemo(
    () =>
      getInteractionsButtons([
        {
          title: 'Transfer',
          contractType: 'TransferContract',
          buttonStyle: 'contextModal',
          defaultValues: {
            receiver: address,
          },
        },
      ]),
    [getInteractionsButtons, address],
  );

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
        {showDropdown && (
          <>
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
                <DropdownLink
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdOpenInNew size={'1.2rem'} />
                  Open in New Tab
                </DropdownLink>
              </DropdownActionItem>
            </DropdownActionItemPadding>
            <DropdownActionItemPadding>
              <Copy
                info={menu.copyInfo}
                data={address}
                color={theme.black}
                style={{ width: '100%' }}
              >
                <DropdownActionItem>
                  <MdContentCopy size={'1.2rem'} />
                  <p>{menu.copyLabel}</p>
                </DropdownActionItem>
              </Copy>
            </DropdownActionItemPadding>
            {menu.addressLike && (
              <>
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
              </>
            )}
          </>
        )}
      </Dropdown>
    </LinkWrapper>
  );
};

export default LinkWithDropdown;
