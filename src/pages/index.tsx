import Head from 'next/head';
import Navbar from '../components/Navbar';
import { BackgroundVideo } from '../views/home';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Klever Explorer</title>
      </Head>

      <main>
        <BackgroundVideo>
          <video playsInline autoPlay muted loop>
            <source src="/background-video.mp4" type="video/mp4" />
          </video>
        </BackgroundVideo>
        <Navbar background={false} />
      </main>
    </>
  );
};

export default Home;
