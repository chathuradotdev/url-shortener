import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
    title: 'Sign In - URL Shortener',
    description: 'Log in to your URL Shortener account to manage links and view analytics.',
    alternates: {
        canonical: '/login',
    },
};

export default function Page() {
    return <LoginForm />;
}
