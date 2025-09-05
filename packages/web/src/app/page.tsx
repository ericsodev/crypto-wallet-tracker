'use client';
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Crypto Portfolio Tracker
      </h1>
      <p className="text-muted-foreground font-normal text-xl max-w-[40ch] text-center">
        Track wallet activity, aggregate portfolio balances, and export financial data.
      </p>
      {data?.user ? (
        <Link href={'/dashboard'}>
          <Button>Go to Dashboard</Button>
        </Link>
      ) : (
        <Button
          onClick={() => {
            signIn('google', { redirectTo: '/dashboard' });
          }}
        >
          Sign in with Google
        </Button>
      )}
    </main>
  );
}
