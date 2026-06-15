export const metadata = {
    title: 'Login',
    description: 'Login to your Eventsora account',
    openGraph: {
        title: 'Login | Eventsora',
        description: 'Login to your Eventsora account to manage events, bookings and more.',
        url: 'https://www.eventsora.com/auth/login',
        images: [
            {
                url: 'https://res.cloudinary.com/dliahmplq/image/upload/v1776787244/Untitled_design_1_qfvqha.png',
                width: 1200,
                height: 630,
                alt: 'Eventsora',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Login | Eventsora',
        description: 'Login to your Eventsora account to manage events, bookings and more.',
        images: ['https://res.cloudinary.com/dliahmplq/image/upload/v1776787244/Untitled_design_1_qfvqha.png'],
    },
};

export default function Layout({ children }) {
    return <>{children}</>;
}
