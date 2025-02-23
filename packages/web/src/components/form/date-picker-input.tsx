import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';

type Props = React.ComponentPropsWithRef<typeof Calendar>;

export function DatePickerInput(props: Props) {
  const [open, setOpen] = useState(false);

  const label = (() => {
    switch (props.mode) {
      case 'single':
        return props.selected ? props.selected.toLocaleDateString() : 'Select Date';
      case 'range':
        if (!props.selected) return 'Select Date';
        return (
          props.selected.from?.toLocaleDateString() +
          (props.selected.to && props.selected.from?.toLocaleDateString() !== props.selected.to.toLocaleDateString()
            ? ' - ' + props.selected.to?.toLocaleDateString()
            : '')
        );
      case 'multiple':
        if (!props.selected || props.selected.length === 0) return 'Select Date';
        return `${props.selected.length} dates selected`;

      default:
        return 'Select date';
    }
  })();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" id="date" className="w-48 justify-between font-normal">
          {label}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar mode="single" captionLayout="dropdown" {...props} />
      </PopoverContent>
    </Popover>
  );
}
