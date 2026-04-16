import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, var(--cyan) 0%, transparent 50%)' }} />
      <main className="z-10 w-full max-w-md">
        <Outlet />
      </main>
    </div>
  );
}
