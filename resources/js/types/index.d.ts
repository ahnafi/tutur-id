import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface NameCategory {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Name {
    id: number;
    name: string;
    slug: string;
    meaning: string;
    origin: string;
    description: string;
    views: number;
    category: NameCategory;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface StoryCategory {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Story {
    id: number;
    title: string;
    slug: string;
    content: string;
    origin_place: string;
    gmaps_link: string;
    is_official: boolean;
    created_by: number;
    total_reads: number;
    image: string | null;
    story_category_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    story_category?: StoryCategory;
    creator?: User;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
