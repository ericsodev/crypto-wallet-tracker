'use client';

import { Button } from '@/components/ui/button';
import { PaginationMetadata } from '@common/database/repositories/utils/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function PaginationControls({ pagination }: { pagination: PaginationMetadata }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const showingLower = (pagination.currentPage - 1) * 20 + 1;
  const showingUpper = pagination.currentPage * 20;

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground">
        Showing {showingLower}-{showingUpper} of {pagination.totalCount} transactions
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.currentPage <= 1}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('page', (Number(params.get('page') || 2) - 1).toString());
            replace(`${pathname}?${params.toString()}`);
          }}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.currentPage >= pagination.totalPages}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set('page', (Number(params.get('page') || 1) + 1).toString());
            replace(`${pathname}?${params.toString()}`);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
