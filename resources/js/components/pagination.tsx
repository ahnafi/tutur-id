import { Button } from '@/components/ui/button';
import { PaginatedData } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: PaginatedData<any>;
    preserveQuery?: boolean;
}

export function Pagination({ data, preserveQuery = true }: PaginationProps) {
    const handlePageChange = (url: string | null) => {
        if (!url) return;

        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);

        // Preserve current query parameters
        if (preserveQuery) {
            const currentParams = new URLSearchParams(window.location.search);
            for (const [key, value] of currentParams) {
                if (key !== 'page') {
                    params.set(key, value);
                }
            }
        }

        router.get(
            `${urlObj.pathname}?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: false,
            },
        );
    };

    const renderPageNumbers = () => {
        const pages = [];
        const currentPage = data.current_page;
        const lastPage = data.last_page;

        // Always show first page
        if (currentPage > 3) {
            pages.push(
                <Button
                    key={1}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(`${data.path}?page=1`)}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                >
                    1
                </Button>,
            );

            if (currentPage > 4) {
                pages.push(
                    <span key="ellipsis1" className="px-2 text-amber-600">
                        ...
                    </span>,
                );
            }
        }

        // Show pages around current page
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(lastPage, currentPage + 2); i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(`${data.path}?page=${i}`)}
                    className={
                        i === currentPage
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-700'
                    }
                >
                    {i}
                </Button>,
            );
        }

        // Always show last page
        if (currentPage < lastPage - 2) {
            if (currentPage < lastPage - 3) {
                pages.push(
                    <span key="ellipsis2" className="px-2 text-amber-600">
                        ...
                    </span>,
                );
            }

            pages.push(
                <Button
                    key={lastPage}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(`${data.path}?page=${lastPage}`)}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                    {lastPage}
                </Button>,
            );
        }

        return pages;
    };

    if (data.last_page <= 1) return null;

    return (
        <div className="very-small-font-size flex flex-col-reverse items-center justify-between gap-2 md:flex-row md:gap-0">
            <div className="text-amber-600">
                Menampilkan {data.from} - {data.to} dari {data.total} hasil
            </div>

            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(data.prev_page_url)}
                    disabled={!data.prev_page_url}
                    className="very-small-font-size border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
                >
                    <ChevronLeft className="mr-1 hidden h-4 w-4 md:block" />
                    Sebelumnya
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">{renderPageNumbers()}</div>

                {/* Next Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(data.next_page_url)}
                    disabled={!data.next_page_url}
                    className="very-small-font-size border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
                >
                    Selanjutnya
                    <ChevronRight className="ml-1 hidden h-4 w-4 md:block" />
                </Button>
            </div>
        </div>
    );
}
