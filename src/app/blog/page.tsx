import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Bell,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | ANDE Network',
  description: 'Latest news, updates, and insights from the ANDE Network team.',
};

// Mock blog posts - in production these would come from a CMS
const mockPosts = [
  {
    id: 1,
    title: 'Introducing ANDE Network: A Sovereign EVM Rollup',
    excerpt: 'Learn about ANDE Network, our unique Token Duality feature, and how we are building the future of scalable blockchain infrastructure.',
    date: '2025-01-15',
    author: 'ANDE Team',
    category: 'Announcement',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Understanding Token Duality: Native + ERC-20 in One',
    excerpt: 'Deep dive into how our Token Duality precompile enables seamless DeFi integration without wrapped tokens.',
    date: '2025-01-10',
    author: 'ANDE Team',
    category: 'Technical',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'MEV Redistribution: Fair Value for Stakers',
    excerpt: 'Explore how ANDE redistributes 80% of MEV to stakers, creating a more equitable blockchain ecosystem.',
    date: '2025-01-05',
    author: 'ANDE Team',
    category: 'Technical',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Staking Guide: Maximize Your ANDE Rewards',
    excerpt: 'A comprehensive guide to staking ANDE tokens across our three pool tiers for optimal returns.',
    date: '2025-01-01',
    author: 'ANDE Team',
    category: 'Guide',
    readTime: '7 min read',
  },
];

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Announcement':
      return 'bg-blue-500/10 text-blue-500';
    case 'Technical':
      return 'bg-purple-500/10 text-purple-500';
    case 'Guide':
      return 'bg-green-500/10 text-green-500';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      {/* Header */}
      <section className="text-center mb-16">
        <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
          Coming Soon
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          ANDE Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          News, updates, and insights from the ANDE Network team.
          Technical deep-dives, tutorials, and community highlights.
        </p>
      </section>

      {/* Preview Posts */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Preview: Upcoming Posts</h2>
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <Card key={post.id} className="opacity-70 hover:opacity-90 transition-opacity">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" disabled>
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stay Updated */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardContent className="py-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Stay Updated</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Follow us on Twitter for the latest news, announcements, and technical updates
              about ANDE Network.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <a href="https://twitter.com/andechain" target="_blank" rel="noopener noreferrer">
                  Follow @andechain
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/AndeLabs/ande-chain" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
