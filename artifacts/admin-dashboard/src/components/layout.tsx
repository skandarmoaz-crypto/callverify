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

import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import {
  Code2, KeyRound, LayoutDashboard, List, LogOut,
  Menu, Settings, ShieldAlert, X,
} from 'lucide-react';
import { useState } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard',  label: 'لوحة التحكم',   icon: LayoutDashboard },
    { href: '/sessions',   label: 'الجلسات',        icon: List },
    { href: '/api-keys',   label: 'مفاتيح API',     icon: KeyRound },
    { href: '/settings',   label: 'الإعدادات',      icon: Settings },
    { href: '/developer',  label: 'دليل المطوّر',   icon: Code2 },
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row" dir="rtl">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
            <ShieldAlert size={20} />
          </div>
          <span className="font-bold tracking-tight">CallVerify</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 right-0 h-[100dvh] z-50 w-72 bg-card border-l border-border flex flex-col
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-border">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <ShieldAlert size={24} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">CallVerify</h1>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-nav-${item.href.slice(1)}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon size={19} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={logout}
            data-testid="button-logout"
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background/50">
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
