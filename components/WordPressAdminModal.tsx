// components/WordPressAdminModal.tsx
'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Server,
  Lock,
  Key,
  Layers,
  X,
  FileText,
  Code2,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export function WordPressAdminModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [wpUrl, setWpUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ftt_wp_backend_url') || 'https://backend.forextradetech.com';
    }
    return 'https://backend.forextradetech.com';
  });
  const [pingStatus, setPingStatus] = useState<'idle' | 'checking' | 'connected' | 'mock'>('idle');

  const handleSaveUrl = (url: string) => {
    setWpUrl(url);
    localStorage.setItem('ftt_wp_backend_url', url);
  };

  const handleTestConnection = async () => {
    setPingStatus('checking');
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ generalSettings { title } }' }),
      });
      const data = await res.json();
      if (data?.meta?.source?.includes('Live')) {
        setPingStatus('connected');
      } else {
        setPingStatus('mock');
      }
    } catch {
      setPingStatus('mock');
    }
  };

  // Derive admin dashboard URLs
  const cleanBase = wpUrl.replace(/\/graphql\/?$/, '').replace(/\/$/, '');
  const adminUrl = `${cleanBase}/wp-admin`;
  const pagesUrl = `${cleanBase}/wp-admin/edit.php?post_type=page`;
  const postsUrl = `${cleanBase}/wp-admin/edit.php?post_type=post`;
  const acfUrl = `${cleanBase}/wp-admin/edit.php?post_type=acf-field-group`;
  const graphiqlUrl = `${cleanBase}/wp-admin/admin.php?page=graphiql-ide`;

  return (
    <>
      {/* Trigger Button inside Site Header or Floating */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#192219] hover:bg-[#2c382b] text-[#d9f17a] text-xs font-mono font-bold tracking-tight transition-all shadow-sm border border-[#303d2e]"
        title="Open WordPress Admin Dashboard & Backend Settings"
      >
        <Server className="w-3.5 h-3.5 text-[#d9f17a]" />
        <span>WP Admin</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#dedfd8] shadow-2xl overflow-hidden text-[#192219]">
            {/* Header */}
            <div className="p-6 bg-[#17211a] text-white flex items-center justify-between border-b border-[#2a382d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d9f17a] text-[#17211a] flex items-center justify-center font-bold font-mono">
                  WP
                </div>
                <div>
                  <h3 className="text-lg font-bold">WordPress Admin Access</h3>
                  <p className="text-xs text-[#a2b59f] font-mono">
                    Headless CMS Origin Management &amp; Direct Logins
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
              {/* Architecture Explanation */}
              <div className="p-4 rounded-2xl bg-[#f4f5f0] border border-[#dedfd8] text-xs leading-relaxed text-[#515c50]">
                <strong className="text-[#192219] block text-sm font-bold mb-1">
                  How Headless WordPress Admin Works:
                </strong>
                In a Headless architecture, your <strong>WordPress backend</strong> is decoupled from this Next.js frontend.
                Your WordPress installation runs on a server host (e.g. WP Engine, Cloudways, Kinsta, or VPS), where your WordPress Admin Dashboard is located at{' '}
                <code className="bg-white px-2 py-0.5 rounded text-[#2d4d24] font-mono border border-[#dfe4d9]">
                  /wp-admin
                </code>
                . When you edit pages or post signals there, Next.js queries them instantly via WPGraphQL and updates using ISR.
              </div>

              {/* Backend URL Input & Health Check */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#7a865a] uppercase tracking-wider mb-1.5">
                  Your WordPress Origin URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={wpUrl}
                    onChange={(e) => handleSaveUrl(e.target.value)}
                    placeholder="https://your-wordpress-domain.com"
                    className="flex-1 bg-[#fafbf8] border border-[#dedfd8] rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#86a627]"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={pingStatus === 'checking'}
                    className="px-4 py-2 bg-[#f4f5f0] hover:bg-[#e6ebdf] text-[#192219] border border-[#dedfd8] rounded-xl text-xs font-bold font-mono inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {pingStatus === 'checking' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#71823c]" />
                    )}
                    <span>Test Ping</span>
                  </button>
                </div>

                {pingStatus === 'connected' && (
                  <p className="text-[11px] font-mono text-emerald-700 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>WPGraphQL is connected and responding!</span>
                  </p>
                )}
                {pingStatus === 'mock' && (
                  <p className="text-[11px] font-mono text-amber-700 mt-1.5 flex items-center gap-1">
                    <span>⚡ Using Next.js Headless Fallback Engine (Live host pending DNS)</span>
                  </p>
                )}
              </div>

              {/* Direct Quick Launch Links */}
              <div>
                <span className="block text-xs font-mono font-bold text-[#7a865a] uppercase tracking-wider mb-2">
                  One-Click WordPress Admin Shortcuts
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#192219] hover:bg-[#283628] text-white flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-[#d9f17a]" />
                      <div className="text-left">
                        <span className="font-bold text-xs block">Main WP Admin</span>
                        <span className="text-[10px] text-[#a2b59f] font-mono">{adminUrl}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d9f17a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href={pagesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#f4f5f0] hover:bg-[#e9eee2] text-[#192219] border border-[#dedfd8] flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#71823c]" />
                      <div className="text-left">
                        <span className="font-bold text-xs block">Edit Pages</span>
                        <span className="text-[10px] text-[#767970] font-mono">/wp-admin/edit.php</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#71823c]" />
                  </a>

                  <a
                    href={acfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#f4f5f0] hover:bg-[#e9eee2] text-[#192219] border border-[#dedfd8] flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-[#71823c]" />
                      <div className="text-left">
                        <span className="font-bold text-xs block">ACF Custom Fields</span>
                        <span className="text-[10px] text-[#767970] font-mono">Forex Schema</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#71823c]" />
                  </a>

                  <a
                    href={graphiqlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#f4f5f0] hover:bg-[#e9eee2] text-[#192219] border border-[#dedfd8] flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Code2 className="w-4 h-4 text-[#71823c]" />
                      <div className="text-left">
                        <span className="font-bold text-xs block">WPGraphQL IDE</span>
                        <span className="text-[10px] text-[#767970] font-mono">Query Schema</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#71823c]" />
                  </a>
                </div>
              </div>

              {/* Login Credentials & Reset Instructions */}
              <div className="p-4 rounded-2xl bg-[#fbfcf9] border border-[#e5e8e0] text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#192219]">
                  <Key className="w-4 h-4 text-[#71823c]" />
                  <span>How to Log In:</span>
                </div>
                <p className="text-[#5c675c] leading-relaxed">
                  1. Visit your origin admin URL: <code className="font-mono text-[#315c28]">{adminUrl}</code>
                  <br />
                  2. Log in with the administrator username and password created during your WordPress setup.
                  <br />
                  3. If you forgot your password, click &quot;Lost your password?&quot; on the WordPress login screen or reset it via WP-CLI / cPanel / phpMyAdmin.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#fafbf8] border-t border-[#dedfd8] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#7a865a]">
                Headless WordPress App Router Bridge
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#192219] hover:bg-[#283628] text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
