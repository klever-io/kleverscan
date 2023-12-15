import { useTheme } from '@/contexts/theme';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { BiHelpCircle } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
import {
  BodyModal,
  Container,
  ContentHeader,
  HeaderModal,
  ImageContainer,
  InformationDiv,
  Title,
} from './styles';

interface IWalletDrawer {
  closeDrawer: () => void;
  opened: boolean;
  clickConnectionMobile: () => void;
}

const WalletHelp: React.FC<IWalletDrawer> = ({
  closeDrawer,
  opened,
  clickConnectionMobile,
}) => {
  const [mounted, setMounted] = useState(false);
  const { isDarkTheme } = useTheme();
  const handleClick = () => {
    closeDrawer();
    clickConnectionMobile();
  };
  const changeColor = {
    color: isDarkTheme ? 'white' : 'black',
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ position: 'absolute' }}>
      {typeof window !== 'undefined' &&
        mounted &&
        ReactDOM.createPortal(
          <>
            <Container $opened={opened}>
              <HeaderModal>
                <ContentHeader>
                  <BiHelpCircle size={'1.5rem'} color={changeColor.color} />
                  <span>Help</span>
                </ContentHeader>
                <div>
                  <IoIosClose
                    size={'2rem'}
                    onClick={handleClick}
                    color={changeColor.color}
                    cursor={'pointer'}
                  />
                </div>
              </HeaderModal>
              <BodyModal>
                <InformationDiv>
                  <AiFillExclamationCircle
                    color="rgb(170, 51, 181)"
                    size={'1.1rem'}
                  />
                  <p> To create transactions, you need to connect a wallet</p>
                </InformationDiv>
                <Title>
                  <span>How to install Klever Extension in Google Chrome</span>
                </Title>
                <p>
                  Klever Extension is a secure multi-crypto wallet and gateway
                  to blockchain applications. It is a non-custodial wallet to
                  anonymously store crypto-assets and connect to applications
                  from multiple blockchains including Bitcoin (BTC), Ethereum
                  (ETH), BSC (BNB), KleverChain (KLV) and Tron (TRX).
                </p>
                <p>
                  It is available for Google Chrome and Chromium based browsers.
                </p>
                <br />
                <p>To access the Klever Extension, follow the steps below:</p>
                <p>
                  <strong>Step 1</strong>:{' '}
                  <a
                    href="https://chromewebstore.google.com/detail/klever-wallet/ifclboecfhkjbpmhgehodcjpciihhmif"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Click here
                  </a>{' '}
                  to open Klever Extension in Chrome Web Store.
                </p>
                <p>
                  <strong>Step 2</strong>: Add Klever Extension to your Google
                  Chrome browser by clicking the <strong>Add to Chrome</strong>{' '}
                  button.
                </p>
                <ImageContainer>
                  <Image
                    src="/extension/webstore.png"
                    alt="WebStore"
                    width="800"
                    height="420"
                    loader={({ src, width }) => `${src}?w=${width}`}
                  />
                </ImageContainer>
                <p>
                  <strong>Step 3</strong>: Click the extension icon to open the
                  Klever Extension. And follow the instructions to create a new
                  wallet or import an existing wallet.
                </p>
                <ImageContainer>
                  <Image
                    src="/extension/extension.png"
                    alt="Extension"
                    width="240"
                    height="400"
                    loader={({ src, width }) => `${src}?w=${width}`}
                  />
                </ImageContainer>
                <p>
                  <strong>Step 4</strong>: Once you have created a wallet, you
                  can start using Klever Extension to connect to web
                  applications and create transactions.
                </p>
                <p>
                  Reload the page and click the <strong>Connect</strong> button
                  to connect your wallet.
                </p>
                <br />
                <p>
                  If you have any issue with Klever Extension or you want to
                  submit feedback, please contact Klever support at:{' '}
                  <a href="http://support.klever.io/hc/en-us/requests/new">
                    http://support.klever.io/hc/en-us/requests/new.
                  </a>
                </p>
              </BodyModal>
            </Container>
          </>,
          window.document.body,
        )}
    </div>
  );
};

export default WalletHelp;
