import Head from 'next/head';
import Navbar from '../components/Navbar';
import { BackgroundVideo } from '../views/home';

import { BackgroundVideo, InputContainer } from '../views/home';

import Input from '../components/Input';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Klever Explorer</title>
      </Head>

      <Navbar background={false} />

      <main>
        <BackgroundVideo>
          <video playsInline autoPlay muted loop>
            <source src="/background-video.mp4" type="video/mp4" />
          </video>
        </BackgroundVideo>
        <InputContainer>
          <span>
            <strong>Klever</strong> Blockchain Explorer
          </span>
          <Input mainPage />
        </InputContainer>
      </main>
    </>
  );
};

export default Home;
