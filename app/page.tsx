import SpecialOffers from './components/SpecialOffers';
import MainMenu from './components/MainMenu';
import CartSection from './components/CartSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <SpecialOffers />
      <MainMenu />
      <CartSection />
      <Footer />
    </main>
  );
}
