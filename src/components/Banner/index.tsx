import api from '@/services/api';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { BannerContainer, BannerParagraph, ButtonClose } from './styled';

interface IResultsHeath {
  name: string;
  status: string;
  message: string;
}

interface IHeathReturn {
  code: string;
  data: {
    health: {
      results: IResultsHeath[];
    };
  };
  error: string;
}

const errorMessage = {
  WARNING:
    "Warning: It appears that the server response time is slightly above the expected rate at the moment. We're working to optimize this. Your patience is appreciated as we fine-tune performance.",
  ALERT:
    "We're facing a temporary performance issue affecting server response time. Our team is actively resolving this issue. We apologize for the inconvenience.",
  CRITICAL:
    "We regret to inform you that we're experiencing issues establishing a connection with the server right now. Our technical team is aware of the problem and is working to resolve it as quickly as possible. Please wait a while and try again.",
};

const healthRequest = async (): Promise<IResultsHeath[]> => {
  try {
    const res: IHeathReturn = await api.get({
      route: 'health',
    });

    const message = res.data.health.results.map(value => value.message);
    message.forEach(element => {
      if (element !== '') {
        Bugsnag.notify(new Error(element));
        console.warn(element);
      }
    });
    return res.data.health.results;
  } catch (error) {
    throw error;
  }
};

const BannerResult: React.FC<IResultsHeath> = (data: IResultsHeath) => {
  const [openBanner, setOpenBanner] = useState<boolean>();

  const handleClick = () => {
    const bannerClosed = JSON.parse(
      sessionStorage.getItem('bannerClosed') || '{}',
    );
    bannerClosed[data.name] = true;
    sessionStorage.setItem('bannerClosed', JSON.stringify(bannerClosed));
    setOpenBanner(!openBanner);
  };

  useEffect(() => {
    const bannerClosed = JSON.parse(
      sessionStorage.getItem('bannerClosed') || '{}',
    );
    setOpenBanner(!bannerClosed[data.name]);
  }, [openBanner]);

  return (
    <>
      {openBanner && data.status !== 'OK' && data.message && (
        <BannerContainer status={data.status === 'ALERT'}>
          <BannerParagraph>{`Status ${data.name} request: ${
            errorMessage[data.status]
          }`}</BannerParagraph>
          <ButtonClose onClick={handleClick} />
        </BannerContainer>
      )}
    </>
  );
};

const Banner: React.FC = () => {
  const { data: res, isLoading: loading } = useQuery({
    queryKey: ['healthRequest'],
    queryFn: healthRequest,
  });

  useEffect(() => {
    Bugsnag.start({
      apiKey: process.env.BUGSNAG_KEY || '7bf586baa26d4d454069c96573fa0b08',
      plugins: [new BugsnagPluginReact(React)],
    });
  }, []);

  return !loading ? (
    <>
      {res?.map(result => (
        <BannerResult {...result} key={result.name} />
      ))}
    </>
  ) : (
    <></>
  );
};

export default Banner;
