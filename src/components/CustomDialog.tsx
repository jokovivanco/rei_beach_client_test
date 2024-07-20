import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LucideType } from 'lucide-react';
import React, { useState } from 'react';

interface CustomDialogProps {
  buttonText: string;
  buttonIcon: ReturnType<typeof LucideType>;
  title: string;
  bgColor?: string;
  bgColorHover?: string;
  disabled?: boolean;
  children: (state: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}

const CustomDialog = ({
  buttonText,
  buttonIcon,
  title,
  bgColor = 'bg-slate-900',
  bgColorHover = 'bg-slate-700',
  disabled = false,
  children,
}: CustomDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className={`flex gap-1 items-center ${bgColor} hover:${bgColorHover}`}
        >
          {buttonIcon}
          <span>{buttonText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children({ setOpen })}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
