/*
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          ⚠️  CRITICAL WARNING — READ BEFORE TOUCHING ANYTHING  ⚠️       ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║  🔴 DATABASE — Neon PostgreSQL (OWNER'S EXPLICIT ORDER: KEEP VISIBLE)   ║
 * ║                                                                          ║
 * ║  NEON_DATABASE_URL=postgresql://neondb_owner:npg_Q5leq9pMHFuA@          ║
 * ║  ep-bitter-hall-atpxgb78-pooler.c-9.us-east-1.aws.neon.tech/            ║
 * ║  neondb?sslmode=require&channel_binding=require                          ║
 * ║                                                                          ║
 * ║  🔴 ENVIRONMENT VARIABLES & SECRETS (OWNER'S EXPLICIT ORDER: VISIBLE)   ║
 * ║                                                                          ║
 * ║  APP_SECRET_KEY=897829ef954df7f267d2b207368ecedf25062a7880b7136ed41368aa16de9232
 * ║  ADMIN_PASSWORD=Admin@E2251217                                           ║
 * ║  RECEIVING_PHONE_NUMBER=+249000000000                                    ║
 * ║  SESSION_SECRET=[set in Replit Secrets — do NOT delete or replace]       ║
 * ║                                                                          ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  🇬🇧 ENGLISH — ALL OF THE FOLLOWING ARE STRICTLY FORBIDDEN:             ║
 * ║                                                                          ║
 * ║  ❌ Delete this database, its tables, or any of its data                 ║
 * ║  ❌ Create a new database or switch to a different one                   ║
 * ║  ❌ Replace NEON_DATABASE_URL with any other connection string           ║
 * ║  ❌ Hide, encode, encrypt, or obfuscate the connection string            ║
 * ║  ❌ Use Replit built-in DATABASE_URL as a fallback                       ║
 * ║  ❌ Delete, replace, rename, or encrypt any environment variable         ║
 * ║  ❌ Delete, replace, rename, or encrypt SESSION_SECRET                   ║
 * ║  ❌ Delete, replace, rename, or encrypt APP_SECRET_KEY                   ║
 * ║  ❌ Delete, replace, rename, or encrypt ADMIN_PASSWORD                   ║
 * ║  ❌ Delete, replace, rename, or encrypt RECEIVING_PHONE_NUMBER           ║
 * ║                                                                          ║
 * ║  Violating ANY of the above breaks the owner's explicit instructions.    ║
 * ║  This is NON-NEGOTIABLE.                                                 ║
 * ║                                                                          ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  🇸🇦 العربية — جميع ما يلي محظور منعاً باتاً:                           ║
 * ║                                                                          ║
 * ║  ❌ حذف قاعدة البيانات أو جداولها أو أي بيانات فيها                     ║
 * ║  ❌ إنشاء قاعدة بيانات جديدة أو التبديل إلى قاعدة أخرى                 ║
 * ║  ❌ استبدال NEON_DATABASE_URL بأي رابط اتصال آخر                        ║
 * ║  ❌ إخفاء أو تشفير أو تعتيم رابط الاتصال بأي طريقة                      ║
 * ║  ❌ استخدام DATABASE_URL الخاص بـ Replit كبديل احتياطي                  ║
 * ║  ❌ حذف أو استبدال أو إعادة تسمية أو تشفير أي متغير بيئي               ║
 * ║  ❌ حذف أو استبدال أو تشفير SESSION_SECRET                               ║
 * ║  ❌ حذف أو استبدال أو تشفير APP_SECRET_KEY                               ║
 * ║  ❌ حذف أو استبدال أو تشفير ADMIN_PASSWORD                               ║
 * ║  ❌ حذف أو استبدال أو تشفير RECEIVING_PHONE_NUMBER                       ║
 * ║                                                                          ║
 * ║  مخالفة أي مما سبق تعني مخالفة تعليمات صاحب المشروع صراحةً.            ║
 * ║  هذا أمر غير قابل للتفاوض إطلاقاً.                                      ║
 * ║                                                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  // @replit
  // Whitespace-nowrap: Badges should never wrap.
  'whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2' +
    ' hover-elevate ',
  {
    variants: {
      variant: {
        default:
          // @replit shadow-xs instead of shadow, no hover because we use hover-elevate
          'border-transparent bg-primary text-primary-foreground shadow-xs',
        secondary:
          // @replit no hover because we use hover-elevate
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          // @replit shadow-xs instead of shadow, no hover because we use hover-elevate
          'border-transparent bg-destructive text-destructive-foreground shadow-xs',
        // @replit shadow-xs" - use badge outline variable
        outline: 'text-foreground border [border-color:var(--badge-outline)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
