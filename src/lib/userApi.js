import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Legacy clients may still send userEmail; it must never select the account.
export async function requireUserEmail(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Response(JSON.stringify({ error: 'Cần đăng nhập' }), {
    status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
  if (req.method !== 'GET') {
    const origin = req.headers.get('origin');
    if (!origin || origin !== new URL(req.url).origin) throw new Response(JSON.stringify({ error: 'Origin không hợp lệ' }), {
      status: 403, headers: { 'Content-Type': 'application/json' },
    });
  }
  return session.user.email;
}

export function apiError(error) {
  return error instanceof Response ? error : Response.json({ error: 'Không thể xử lý dữ liệu' }, { status: 500 });
}

export function validMovieKey(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 300;
}
