'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues with complex client components
const ClaudeStarshipControlPanel = dynamic(
  () => import('../../docs/claude-starship-control-panel'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <ClaudeStarshipControlPanel />
    </div>
  );
}
