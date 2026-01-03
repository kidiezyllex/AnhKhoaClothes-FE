"use client"
import { HeroBanner } from './HeroBanner';
import { BrandLogos } from './BrandLogos';
import { Categories } from './Categories';
import { Testimonials } from './Testimonials';
import { Newsletter } from './Newsletter';
import { Collections } from './Collections';
import { NewArrivals } from './NewArrivals';
import { BestSeller } from './BestSeller';
import Footer from '../Common/Footer';
import NavigationBar from './NavigationBar';

export const HomePage = () => {
    return (
        <main className="min-h-screen bg-background">
            <NavigationBar />
            <HeroBanner />
            <BrandLogos />
            <Categories />
            <Collections />
            <NewArrivals />
            <BestSeller />
            <Testimonials />
            <Newsletter />
            <Footer />
        </main>
    );
};

export default HomePage; 