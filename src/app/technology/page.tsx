import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { CheckCircle } from 'lucide-react';
  
  const techStack = [
    {
      category: 'Frontend Framework',
      items: [
        { name: 'Next.js 15.3+', reason: 'React Server Components reduce JS bundles by 30-50%.' },
        { name: 'React 18.3+', reason: 'Streaming SSR improves Time to First Byte (TTFB) by up to 60%.' },
        { name: 'TypeScript 5.9+', reason: 'Ensures type safety and better developer experience.' },
        { name: 'Turbopack (Dev)', reason: 'Faster development server and builds.' },
      ],
    },
    {
        category: 'Blockchain Integration',
        items: [
          { name: 'Wagmi', reason: 'Provides React hooks for Ethereum, simplifying wallet and contract interaction.' },
          { name: 'Viem', reason: 'A lightweight and efficient TypeScript interface for Ethereum.' },
          { name: 'TanStack Query', reason: 'Manages server state, caching, and real-time data fetching.' },
        ],
    },
    {
        category: 'Styling & UI',
        items: [
            { name: 'Tailwind CSS', reason: 'A utility-first CSS framework for rapid UI development.' },
            { name: 'ShadCN/UI', reason: 'A collection of beautifully designed, accessible, and customizable components.' },
            { name: 'Framer Motion', reason: 'For fluid animations and interactive user experiences.' },
        ],
    }
  ];
  
  export default function TechnologyPage() {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Our Technology</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                We use a modern, performance-focused stack to deliver a best-in-class experience.
            </p>
        </div>

        <div className="space-y-12">
            {techStack.map(section => (
                <div key={section.category}>
                    <h2 className="text-2xl font-semibold mb-6">{section.category}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.items.map(item => (
                            <Card key={item.name}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="text-primary h-6 w-6" />
                                        {item.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{item.reason}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>

      </div>
    );
  }
  