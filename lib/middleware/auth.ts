import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, token: any) => Promise<NextResponse>
) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || 'demo-secret'
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, token);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function withRole(
  request: NextRequest,
  allowedRoles: string[],
  handler: (request: NextRequest, token: any) => Promise<NextResponse>
) {
  return withAuth(request, async (req, token) => {
    const userRole = token.role || 'user';
    
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return handler(req, token);
  });
}
