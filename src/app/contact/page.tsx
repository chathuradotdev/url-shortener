import { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us - Get in Touch',
    description: 'Have questions or feedback? Contact the URL Shortener team for support and inquiries.',
    alternates: {
        canonical: '/contact',
    },
};

export default function Page() {
    return <ContactForm />;
}
