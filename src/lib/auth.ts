import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'rencana_tuhan_studio_secret_key_2026_cinematic';
const KEY = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: { userId: string; username: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, KEY, {
      algorithms: ['HS256'],
    });
    return payload as { userId: string; username: string };
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return null;
  }
}

export async function checkAuth(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('rts_auth_token='))
    ?.split('=')[1];

  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

