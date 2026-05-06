import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Services from "@/components/Services";
import Booking from "@/components/Booking";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import OmOs from "@/components/OmOs";
import VirtualTour from "@/components/VirtualTour";

const Index = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Reviews />
      <VirtualTour />
      <About />
      <Gallery />
      <OmOs />
      <Services />
      <Booking />
      <Location />
    </main>
    <Footer />
  </>
);

export default Index;
