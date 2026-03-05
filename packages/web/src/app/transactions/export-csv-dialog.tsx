'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download } from 'lucide-react';
import { TransactionType } from '@common/database/tables/transaction-table';
import { TransactionDTO } from '@common/database/repositories/transaction-repository';
import { exportTransactions } from '../actions/export-transactions';

interface FieldConfig {
  key: keyof TransactionDTO;
  label: string;
  enabled: boolean;
}

const DEFAULT_FIELDS: FieldConfig[] = [
  { key: 'timestamp', label: 'Date', enabled: true },
  { key: 'type', label: 'Type', enabled: true },
  { key: 'amount', label: 'Amount', enabled: true },
  { key: 'fee', label: 'Gas Fee', enabled: true },
  { key: 'senderAddress', label: 'Sender', enabled: true },
  { key: 'recipientAddress', label: 'Recipient', enabled: true },
  { key: 'hash', label: 'Tx Hash', enabled: true },
  { key: 'blockNumber', label: 'Block', enabled: false },
  { key: 'walletId', label: 'Wallet ID', enabled: false },
  { key: 'id', label: 'ID', enabled: false },
];

function buildCsv(rows: TransactionDTO[], schema: FieldConfig[]): string {
  const active = schema.filter(f => f.enabled);
  const headers = active.map(f => f.label);
  const dataRows = rows.map(row => active.map(f => String(row[f.key] ?? '')));
  return [headers, ...dataRows].map(r => r.join(',')).join('\n');
}

export interface ExportCsvDialogProps {
  walletId?: string;
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  trigger?: React.ReactNode;
}

export function ExportCsvDialog({ walletId, startDate, endDate, type, trigger }: ExportCsvDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FieldConfig[]>(DEFAULT_FIELDS);
  const [isLoading, setIsLoading] = useState(false);

  const toggleField = (key: keyof TransactionDTO) => {
    setFields(prev => prev.map(f => (f.key === key ? { ...f, enabled: !f.enabled } : f)));
  };

  const updateLabel = (key: keyof TransactionDTO, label: string) => {
    setFields(prev => prev.map(f => (f.key === key ? { ...f, label } : f)));
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const rows = await exportTransactions({ walletId, startDate, endDate, type });
      const csv = buildCsv(rows, fields);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.click();
      URL.revokeObjectURL(url);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Export CSV</DialogTitle>
          <DialogDescription>Choose which fields to include and customize column headers.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2 max-h-80 overflow-y-auto">
          {fields.map(field => (
            <div key={field.key} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`field-${field.key}`}
                checked={field.enabled}
                onChange={() => toggleField(field.key)}
                className="h-4 w-4 shrink-0 accent-primary"
              />
              <Input
                className="h-8 text-sm"
                value={field.label}
                onChange={e => updateLabel(field.key, e.target.value)}
                disabled={!field.enabled}
              />
              <span className="text-xs text-muted-foreground w-32 shrink-0">{field.key}</span>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading || fields.every(f => !f.enabled)}>
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? 'Exporting…' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
