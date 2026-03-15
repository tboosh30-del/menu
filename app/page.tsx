import MainMenu from './components/MainMenu';
import CartSection from './components/CartSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="bg-[#fcf4e4]">
      <MainMenu />
      <CartSection />
      <Footer />
    </main>
  );
}
