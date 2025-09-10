'use client';

import { Copy } from 'lucide-react';
import { Button, ButtonProps } from '../ui/button';

interface CopyButtonProps extends ButtonProps {
  value: string;
}
export default function CopyButton({ value, ...props }: CopyButtonProps): React.JSX.Element {
  return (
    <Button
      variant="outline"
      size="sm"
      {...props}
      onClick={() => {
        navigator.clipboard.writeText(value);
      }}
    >
      {props.children}
      <Copy className="h-4 w-4" />
    </Button>
  );
}
