import api from '@/services/api';
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
    'Note: Server response times are currently a bit high. Thanks for your patience.',
  ALERT:
    "We're facing a temporary performance issue affecting server response time. We apologize for the inconvenience.",
  CRITICAL:
    "We're experiencing issues establishing a connection with the server. Our technical team is working to resolve it as quickly as possible. Please wait a while and try again.",
};

const healthRequest = async (): Promise<IResultsHeath[]> => {
  try {
    const res: IHeathReturn = await api.get({
      route: 'health',
    });

    const message = res.data.health.results.map(value => value.message);
    message.forEach(element => {
      if (element !== '') {
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
          <BannerParagraph>{`${data.name.toUpperCase()} service: ${
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

  return !loading ? (
    <>{res?.map(result => <BannerResult {...result} key={result.name} />)}</>
  ) : (
    <></>
  );
};

export default Banner;
