'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('aloatist@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  
  useEffect(() => {
    if (session) {
      router.replace('/admin');
    }
  }, [session, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      } else {
        router.replace('/admin');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Không thể đăng nhập. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8 px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Đăng nhập hệ thống điểm danh</h1>
        <p className="text-sm text-muted-foreground">
          Nhập email và mật khẩu để truy cập bảng điều khiển quản trị.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm backdrop-blur">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email đăng nhập
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Mặc định: <span className="font-medium">conphung87@yahoo.com.vn</span> / <span className="font-medium">admin123</span>
      </p>
    </div>
  );
}
