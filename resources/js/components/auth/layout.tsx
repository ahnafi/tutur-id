import type React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    imageSrc?: string;
    imageAlt?: string;
    reverse?: boolean;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    imageSrc = '/indonesian-traditional-batik-pattern-with-warm-col.png',
    imageAlt = 'Indonesian cultural illustration',
    reverse = false,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen">
            {/* Form Section - Left Side */}
            <div className={`flex flex-1 items-center justify-center section-padding-x py-6 lg:py-12 ${reverse ? 'order-2' : 'order-1'}`}>
                <div className="w-full max-w-2xl space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                        {subtitle && <p className="text-balance text-muted-foreground">{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </div>

            {/* Image Section - Right Side */}
            <div className="hidden flex-1 items-center justify-center bg-card p-12 lg:flex">
                <div className="relative h-96 w-full max-w-lg overflow-hidden rounded-lg shadow-lg">
                    <img src={imageSrc || '/placeholder.svg'} alt={imageAlt} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
            </div>
        </div>
    );
}
