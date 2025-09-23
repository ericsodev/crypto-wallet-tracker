'use client';

import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function TransactionFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [hash, setHash] = useState<string>();
  console.log(hash);
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.get('hash') !== hash) {
      params.set('page', '1');
    }
    if (hash) {
      params.set('hash', hash);
    } else {
      params.delete('hash');
    }
    replace(`${pathname}?${params.toString()}`);
  }, [hash]);
  return (
    <div className="flex">
      <Input
        value={hash}
        onChange={e => {
          setHash(e.target.value);
        }}
      />
    </div>
  );
}
