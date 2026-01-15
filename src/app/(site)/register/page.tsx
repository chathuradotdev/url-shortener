import { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
    title: 'Create Account - URL Shortener',
    description: 'Sign up for a free URL Shortener account to start shortening links and tracking analytics.',
    alternates: {
        canonical: '/register',
    },
};

export default function Page() {
    return <RegisterForm />;
}
