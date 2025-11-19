import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="text-center">
        <CardContent className="py-12">
          <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
            Coming Soon
          </Badge>
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Blog Post</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Blog posts are coming soon. Follow us on Twitter for the latest updates
            and announcements about ANDE Network.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
