import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Github,
  Twitter,
  Linkedin,
  Users,
  Code,
  Palette,
  Shield,
  Building,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ANDE Network Team | Meet the Builders',
  description: 'Meet the team behind ANDE Network - passionate builders creating the next generation of blockchain infrastructure.',
};

// ISR - Regenerate this page every 24 hours
export const revalidate = 86400;

const team = [
  {
    name: 'Core Team',
    description: 'The founding team building ANDE Network',
    members: [
      {
        name: 'Ande Labs',
        role: 'Protocol Development',
        initials: 'AL',
        color: 'bg-blue-500',
        bio: 'Building sovereign rollup infrastructure with cutting-edge technology.',
        skills: ['Rust', 'EVM', 'Cryptography'],
      },
    ],
  },
];

const departments = [
  {
    icon: Code,
    name: 'Engineering',
    description: 'Protocol development, smart contracts, and infrastructure',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    name: 'Security',
    description: 'Audits, monitoring, and incident response',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Palette,
    name: 'Design',
    description: 'User experience and visual design',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Building,
    name: 'Operations',
    description: 'Community, partnerships, and growth',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

const values = [
  {
    title: 'Transparency',
    description: 'Open source code, public roadmap, and clear communication with our community.',
  },
  {
    title: 'Innovation',
    description: 'Pushing boundaries with Token Duality, MEV redistribution, and sovereign rollup architecture.',
  },
  {
    title: 'Community First',
    description: 'Building for users and developers, with fair token distribution and governance.',
  },
  {
    title: 'Security',
    description: 'Rigorous testing, audits, and best practices to protect user assets.',
  },
];

export default function TeamPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Our Team
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Meet the Builders
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A passionate team of blockchain engineers, cryptographers, and designers
          building the future of decentralized infrastructure.
        </p>
      </section>

      {/* Team Members */}
      <section className="mb-16">
        {team.map((group) => (
          <div key={group.name} className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{group.name}</h2>
              <p className="text-muted-foreground">{group.description}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center">
              {group.members.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardHeader>
                    <Avatar className={`w-20 h-20 mx-auto mb-4 ${member.color}`}>
                      <AvatarFallback className="text-2xl font-bold text-white">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Departments */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Departments</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {departments.map((dept) => (
            <Card key={dept.name}>
              <CardContent className="pt-6 text-center">
                <div className={`w-12 h-12 rounded-lg ${dept.bgColor} flex items-center justify-center mx-auto mb-4`}>
                  <dept.icon className={`h-6 w-6 ${dept.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{dept.name}</h3>
                <p className="text-sm text-muted-foreground">{dept.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Our Values
            </CardTitle>
            <CardDescription>
              The principles that guide our work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="p-4 bg-background rounded-lg">
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Join Us CTA */}
      <section className="text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12">
            <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
            <p className="mb-6 opacity-90">
              We're always looking for talented individuals passionate about blockchain technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" asChild>
                <Link href="https://github.com/AndeLabs" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="https://twitter.com/andechain" target="_blank">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
