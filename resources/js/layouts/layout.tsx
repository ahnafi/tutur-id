import { Footer } from '@/components/footer';
import { Navigation } from '@/components/navigation-bar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navigation />
            {children}
            <Footer />
        </>
    );
}
