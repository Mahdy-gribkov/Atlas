import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (request: NextRequest, data: T) => Promise<NextResponse>
) {
  return async function validationMiddleware(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      
      return handler(request, validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }

      console.error('Validation middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function withQueryValidation<T>(
  schema: ZodSchema<T>,
  handler: (request: NextRequest, data: T) => Promise<NextResponse>
) {
  return async function queryValidationMiddleware(request: NextRequest) {
    try {
      const url = new URL(request.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());
      const validatedData = schema.parse(queryParams);
      
      return handler(request, validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { 
            error: 'Query validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }

      console.error('Query validation middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
