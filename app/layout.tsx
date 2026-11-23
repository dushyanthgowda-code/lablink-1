import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LabLink — Making College Laboratories More Accessible',
  description: 'A GenAI-powered campus laboratory resource-sharing platform enabling equipment discovery, intelligent slot booking, faculty approvals, and conflict resolution.',
  keywords: ['Campus Labs', 'Resource Sharing', 'Equipment Booking', 'GenAI', 'Fair Scheduling', 'Google Build with AI'],
  authors: [{ name: 'LabLink Engineering Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col antialiased selection:bg-indigo-600 selection:text-white">
        {/* Accessibility Skip Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-indigo-600 focus:text-white focus:top-0 focus:left-0"
        >
          Skip to main content
        </a>
        
        <div className="flex-1 flex flex-col">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="border-t border-gray-800 bg-gray-950 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-400">LabLink Campus Platform</span>
              <span>•</span>
              <span>PromptWars × Cynergy Coding Club (Build with AI)</span>
            </div>
            <div>
              <span>Engineered with Next.js, TypeScript, Tailwind CSS & Google Gemini AI</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
