import {
  LearnMore,
  Main,
  P1,
  P2,
  Title1,
  Title3,
  TextWrapper,
  Picture,
  Message,
} from './styles';

const Maintenance = () => {
  return (
    <Main>
      <Picture>
        <source srcSet="/maintenance-desktop.png" media="(min-width: 768px)" />
        <img src="/maintenance-mobile.png" alt="Responsive" />
      </Picture>
      <TextWrapper>
        <Title1>Klever Blockchain Under Scheduled Maintenance</Title1>
        <Message>
          <P1>
            We are upgrading the Klever Blockchain Testnet to integrate the
            latest KVM enhancements and core updates for improved performance
            and scalability.
          </P1>
          <Title3>February 7th, 5 PM UTC</Title3>
          <P2>A new era for smart contracts is coming!</P2>
        </Message>
        <LearnMore>
          <a
            href="https://forum.klever.org/t/klever-blockchain-testnet-scheduled-maintenance-a-major-leap-for-kvm/3449"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </LearnMore>
      </TextWrapper>
    </Main>
  );
};

export default Maintenance;
