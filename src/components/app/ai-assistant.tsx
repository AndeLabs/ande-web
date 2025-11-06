'use client';

import { useState } from 'react';
import { Bot, X, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bot className="h-6 w-6" />
          <span className="sr-only">Toggle AI Assistant</span>
        </Button>
      </div>
      <div
        className={cn(
          'fixed bottom-20 right-4 z-50 w-full max-w-sm transition-all duration-300',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <Card className="shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="h-80 overflow-y-auto p-4">
            <p className="text-sm text-muted-foreground">AI Assistant chat will be here.</p>
          </CardContent>
          <CardFooter>
            <div className="relative w-full">
              <Input placeholder="Ask the ANDE AI..." />
              <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
