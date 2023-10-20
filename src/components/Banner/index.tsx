import api from '@/services/api';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { BannerContainer, ButtonClose } from './styled';

interface ReturnHeath {
  name: string;
  status: string;
  message: string;
}

interface IHeathReturn {
  code: string;
  data: {
    health: {
      results: ReturnHeath[];
    };
  };
  error: string;
}

const healthRequest = async (): Promise<ReturnHeath[]> => {
  const res: IHeathReturn = await api.get({
    route: 'health',
  });
  return res.data.health.results;
};

const BannerResult: React.FC<ReturnHeath> = (data: ReturnHeath) => {
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
      {openBanner && data.status !== 'OK' && (
        <BannerContainer status={data.status === 'ALERT'}>
          <p>{data.status + ':' + data.message}</p>
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
