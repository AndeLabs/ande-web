'use client';

import { Button } from "@/components/ui/button";
import { useConnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export default function ConnectPage() {
    const { connectors, connect } = useConnect();
    const { isConnected } = useAccount();
    const router = useRouter();

    useEffect(() => {
        if (isConnected) {
            router.push('/dashboard');
        }
    }, [isConnected, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        <Logo />
                    </div>
                    <CardTitle>Connect Wallet</CardTitle>
                    <CardDescription>Choose a wallet to connect to the ANDE Network App.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {connectors.map((connector) => (
                        <Button
                            key={connector.uid}
                            onClick={() => connect({ connector })}
                            size="lg"
                        >
                            Connect {connector.name}
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
