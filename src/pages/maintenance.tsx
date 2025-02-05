import { LearnMore, Main, P1, P2, Title1, Title3 } from './maintenanceStyles';

const Maintenance = () => {
  return (
    <Main>
      <picture>
        <source
          srcSet="/maintenance-desktop.png"
          media="(max-width: 768px)"
          width={350}
          height={350}
        />
        <img
          src="/maintenance-mobile.png"
          alt="Responsive"
          width={500}
          height={500}
        />
      </picture>
      <Title1>Klever Blockchain Under Scheduled Maintenance</Title1>
      <P1>
        We are upgrading the Klever Blockchain Testnet to integrate the latest
        KVM enhancements and core updates for improved performance and
        scalability.
      </P1>
      <Title3>February 7th, 5 PM UTC</Title3>
      <P2>A new era for smart contracts is coming!</P2>
      <LearnMore>
        <a
          href="https://forum.klever.org/t/klever-blockchain-testnet-scheduled-maintenance-a-major-leap-for-kvm/3449"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
      </LearnMore>
    </Main>
  );
};

export default Maintenance;
