import { useTheme } from '@/contexts/theme';
import Image from 'next/image';
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
  const { isDarkTheme } = useTheme();
  const handleClick = () => {
    closeDrawer();
    clickConnectionMobile();
  };
  const changeColor = {
    color: isDarkTheme ? 'white' : 'black',
  };
  return (
    <Container opened={opened}>
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
          <AiFillExclamationCircle color="rgb(170, 51, 181)" size={'1.1rem'} />
          <p> To create transactions, you need to connect a wallet</p>
        </InformationDiv>
        <Title>
          <span>How to install Klever Extension in Google Chrome</span>
        </Title>
        <h3>
          Klever Extension is a secure multi-crypto wallet and gateway to
          blockchain applications. It is a non-custodial wallet to anonymously
          store crypto-assets and connect to applications from multiple
          blockchains including Bitcoin (BTC), Ethereum (ETH), BSC (BNB),
          KleverChain (KLV) and Tron (TRX).
        </h3>
        <h3>
          Klever has released an open beta version of Klever Extension. Kindly,
          follow these steps to access Klever Extension open beta, and submit
          quality feedbacks for a chance to win some KLV tokens.
        </h3>
        <h3>
          <strong>Step 1</strong>: click{' '}
          <a href="https://klever.finance/klever-extension">here</a> ({' '}
          <a href="https://klever.finance/klever-extension">
            https://klever.finance/klever-extension
          </a>{' '}
          ) to open Klever Extension website.
        </h3>
        <h3>
          <strong>Step 2</strong>: Submit your Google Account email ({' '}
          <a href="mailto:example@gmail.com">@gmail.com</a> ) to access Klever
          Extension open beta. You will receive an email which confirms that you
          will be added to the test program within 24 hours.
        </h3>
        <ImageContainer>
          <Image
            src="/extension/form.png"
            alt="Form"
            width="800"
            height="235"
          />
        </ImageContainer>
        <h3>
          <strong>Step 3</strong>: The email also contains a link to download
          Klever Extension. Kindly, wait 24 hours and then click the link inside
          the email to install Klever Extension on your Google Chrome browser.
          Note, you should log into Chrome Web Store with the same email you
          submitted in the signup form.
        </h3>
        <ImageContainer>
          <Image
            src="/extension/email.png"
            alt="Email"
            width="695"
            height="316"
          />
        </ImageContainer>
        <h3>
          {
            "Once you've downloaded your Klever Extension from the Chrome Web Store, test the extension, and provide quality feedback to be entered into the draws to win some KLV tokens. Eligibility is very much dependent on your quality feedback."
          }
        </h3>
        <h3>
          To submit a <strong>feedback</strong>, kindly fill and submit the form
          at the bottom of the Klever Extension website:{' '}
          <a href="https://klever.finance/klever-extension">
            https://klever.finance/klever-extension
          </a>
        </h3>
      </BodyModal>
    </Container>
  );
};

export default WalletHelp;
