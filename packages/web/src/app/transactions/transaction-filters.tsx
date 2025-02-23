'use client';

import { DatePickerInput } from '@/components/form/date-picker-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionType } from '@common/database/tables/transaction-table';
import { Calendar, ChevronDownIcon, XIcon } from 'lucide-react';
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface TransactionFilters {
  hash?: string;
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
}

const updateSearchParams = (
  oldSearchParams: ReadonlyURLSearchParams,
  filters: TransactionFilters,
): [URLSearchParams, boolean] => {
  const updatedParams = new URLSearchParams(oldSearchParams);
  let hasChanged =
    filters.hash !== oldSearchParams.get('hash') ||
    filters.type !== oldSearchParams.get('type') ||
    filters.startDate !== oldSearchParams.get('startDate') ||
    filters.endDate !== oldSearchParams.get('endDate');

  if (filters.hash) {
    updatedParams.set('hash', filters.hash);
  } else {
    updatedParams.delete('hash');
  }

  if (filters.type) {
    updatedParams.set('type', filters.type);
  } else {
    updatedParams.delete('type');
  }

  if (filters.startDate) {
    updatedParams.set('startDate', filters.startDate);
  } else {
    updatedParams.delete('startDate');
  }

  if (filters.endDate) {
    updatedParams.set('endDate', filters.endDate);
  } else {
    updatedParams.delete('endDate');
  }

  return [updatedParams, hasChanged];
};

export function TransactionFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [filters, setFilters] = useState<TransactionFilters>({});
  useEffect(() => {
    const [updatedParams, hasChanged] = updateSearchParams(searchParams, filters);
    if (hasChanged) {
      replace(`${pathname}?${updatedParams.toString()}`);
    }
  }, [filters]);
  return (
    <div className="flex gap-2">
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="hash">Transaction Hash</Label>
        <Input
          id="hash"
          value={filters?.hash}
          onChange={e => {
            setFilters(filters => ({ ...filters, hash: e.target.value }));
          }}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="hash">Transaction Type</Label>

        <Select
          onValueChange={v => {
            setFilters(filters => ({ ...filters, type: v as TransactionType }));
          }}
          value={filters?.type}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Transaction Type</SelectLabel>
              <SelectItem value={TransactionType.WITHDRAWAL}>Withdraw</SelectItem>
              <SelectItem value={TransactionType.DEPOSIT}>Deposit</SelectItem>
              <SelectItem value={TransactionType.CONTRACT}>Contract</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full items-center gap-3">
        <Label htmlFor="date" className="px-1">
          Start Date Range
        </Label>
        <DatePickerInput
          mode="range"
          selected={
            filters.startDate
              ? { from: new Date(filters.startDate), to: filters.endDate ? new Date(filters.endDate) : undefined }
              : undefined
          }
          onSelect={range => {
            setFilters(filters => ({
              ...filters,
              startDate: range?.from?.toISOString(),
              endDate: range?.to?.toISOString(),
            }));
          }}
        />
      </div>
      <div className="grid items-center gap-3">
        <span></span>
        <Button
          onClick={() => {
            setFilters({});
          }}
        >
          <XIcon className="w-4 h-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
