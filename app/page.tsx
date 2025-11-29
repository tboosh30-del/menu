import Hero from './components/Hero';
import SpecialOffers from './components/SpecialOffers';
import MainMenu from './components/MainMenu';
import CartSection from './components/CartSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <SpecialOffers />
      <MainMenu />
      <CartSection />
      <Footer />
    </main>
  );
}
