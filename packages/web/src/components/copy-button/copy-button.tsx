'use client';

import { Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
  tooltip: string;
}
export default function CopyButton({ value, tooltip: toolTip, ...props }: CopyButtonProps): React.JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent>{toolTip}</TooltipContent>
    </Tooltip>
  );
}
