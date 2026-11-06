'use client';

import { useSession, signOut } from 'next-auth/react';
import { History, LogOut } from 'lucide-react';
import Link from 'next/link';
import { authHref } from '@/lib/authNavigation';

export default function AccountPage() {
  const { data: session, status } = useSession();

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
      <h1 className="text-2xl font-semibold">Tài khoản</h1>
      {status === 'loading' ? (
        <p role="status" className="text-sm text-on-surface-variant">Đang tải thông tin tài khoản…</p>
      ) : session ? (
        <>
          <div className="space-y-1">
            <p className="break-words font-semibold">{session.user?.name || 'Thành viên'}</p>
            <p className="break-all text-sm text-on-surface-variant">{session.user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/history" className="button-primary inline-flex items-center gap-2 px-4 text-sm">
              <History size={17} aria-hidden="true" /> Lịch sử xem
            </Link>
            <button type="button" onClick={() => signOut({ callbackUrl: '/login' })}
              className="glass-trim inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm">
              <LogOut size={17} aria-hidden="true" /> Đăng xuất
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-on-surface-variant">Đăng nhập để xem thông tin tài khoản và lịch sử xem.</p>
          <div className="flex flex-wrap gap-2">
            <Link href={authHref('/login', '/account')} className="button-primary inline-flex items-center px-4 text-sm">Đăng nhập</Link>
            <Link href={authHref('/register', '/account')} className="glass-trim inline-flex min-h-11 items-center rounded-xl px-4 text-sm">Đăng ký</Link>
          </div>
        </>
      )}
    </section>
  );
}
