'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// ✅ FUNGSI GENERATE DEVICE SIGNATURE (Multi-Factor Fingerprint) - dari kode pertama
function getDeviceSignature() {
  // 1. Canvas Fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 100, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Nyopee', 2, 2);
  }
  const canvasHash = canvas.toDataURL().substring(0, 100);

  // 2. Screen Resolution
  const screen = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;

  // 3. Timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // 4. Language
  const language = navigator.language;

  // 5. Platform
  const platform = navigator.platform;

  return {
    canvas: canvasHash,
    screen,
    timezone,
    language,
    platform
  };
}

export default function PromoPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'already' | 'soldout'>('loading');
  const [pemenangKe, setPemenangKe] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');

  // ✅ LOGIKA BARU - Multi-Factor Device Fingerprint (dari kode pertama)
  useEffect(() => {
    const checkPromo = async () => {
      try {
        // Generate device signature
        const signature = getDeviceSignature();

        // Kirim ke API dengan POST method
        const res = await fetch('/api/promo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ signature })
        });

        const data = await res.json();

        if (data.success) {
          setPemenangKe(data.count);
          setStatus('success');
        } else if (data.already) {
          setStatus('already');
        } else {
          setStatus('soldout');
        }
      } catch (e) {
        console.error('Promo check error:', e);
        setStatus('soldout');
      }
    };

    checkPromo();
  }, []);

  // ✅ Jam Digital Real-time (Anti-Screenshot) - dari kode pertama
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Tampilan Loading ---
  if (status === 'loading') {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/tampilan_diskon.png"
            alt="Background"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
            priority
            quality={90}
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-[10px] font-bold tracking-widest uppercase text-orange-600">Menyiapkan Kejutan...</p>
        </div>
      </div>
    );
  }

  // --- 1. TAMPILAN BERHASIL KLAIM ---
  if (status === 'success') {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/tampilan_diskon.png"
            alt="Background"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
            priority
            quality={90}
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 w-full max-w-[310px] bg-white/90 backdrop-blur-md rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-orange-100 text-center p-5 overflow-hidden">

          {/* Logo */}
          <div className="relative w-24 h-24 mx-auto mb-2">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain" priority />
          </div>

          <h1 className="text-lg font-black text-gray-900 mb-1 leading-tight uppercase">
            PROMO SPESIAL<br />
            <span className="text-orange-600 text-2xl block">RAMADHAN</span>
          </h1>

          <p className="text-xs font-medium text-gray-600 mb-3">
            Berbuka makin hemat & nikmat!<br />
            Nikmati <span className="text-orange-600 font-bold text-base px-1">DISKON 15%</span> menu favoritmu di Chikumi.<br />
            <span className="text-[10px] text-gray-400 italic">Cocok untuk buka puasa bareng keluarga & bestie!</span>
          </p>

          {/* Jam Digital Real-time (Anti-Screenshot) */}
          <div className="inline-block px-4 py-1 bg-green-600 rounded-full shadow-md animate-bounce mb-3">
            <p className="text-[11px] font-bold text-white tabular-nums uppercase">
              🕒 Live: {currentTime || '--:--:--'}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Klik tag lokasi untuk menemukan outlet</p>
            <a
              href="https://maps.google.com/?q=Chikumi+Kudus+Jl.+Getas+Pejaten+No.47"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white border border-orange-50 rounded-xl p-2 shadow-sm active:scale-95 transition-transform"
            >
              <p className="text-orange-600 font-black text-sm italic">
                📍 Chikumi Kudus
              </p>
              <p className="text-[9px] text-gray-400 leading-tight">Jl. Getas Pejaten No.47, Kudus</p>
            </a>
          </div>

          <div className="bg-[#5C4033] rounded-2xl py-3 mb-4 text-white shadow-lg relative overflow-hidden">
            <div className="flex justify-center items-baseline gap-1.5 relative z-10">
              <span className="text-3xl font-black tabular-nums">{String(pemenangKe).padStart(2, '0')}</span>
              <span className="text-xs font-bold">ORANG LAGI</span>
            </div>
            <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-3 text-white shadow-md">
            <p className="font-bold text-xs leading-snug">Tunjukkan halaman ini ke kasir dan nikmati diskonnya sekarang</p>
            <div className="mt-2 pt-2 border-t border-white/20 uppercase">
              <p className="text-[7px] opacity-90 font-bold animate-pulse">📸 JANGAN PAKAI SCREENSHOT</p>
            </div>
          </div>

          <p className="mt-4 text-[8px] text-gray-400 font-medium italic">*Promo hanya berlaku untuk 30 orang pertama</p>
        </div>
      </div>
    );
  }

  // --- 2. TAMPILAN SUDAH DIKLAIM ---
  if (status === 'already') {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/tampilan_diskon.png"
            alt="Background"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
            priority
            quality={90}
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 bg-white/95 backdrop-blur-sm p-8 rounded-[2rem] shadow-xl max-w-[300px] w-full border border-orange-100 text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-lg font-black text-gray-900 mb-3 uppercase tracking-tight">Sudah Terklaim</h1>
          <p className="text-gray-500 text-[11px] leading-relaxed mb-5">
            Satu perangkat hanya berlaku untuk satu kali klaim. <br />
            Sampai jumpa di promo berikutnya!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[9px] font-black text-orange-400 underline uppercase tracking-widest hover:text-orange-600 transition-colors"
          >
            Refresh Status
          </button>
          <div className="opacity-20 grayscale relative w-10 h-10 mx-auto mt-4">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
          </div>
        </div>
      </div>
    );
  }

  // --- 3. TAMPILAN SOLDOUT ---
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/tampilan_diskon.png"
          alt="Background"
          fill
          className="object-cover"
          style={{ objectPosition: 'center' }}
          priority
          quality={90}
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm p-8 rounded-[2rem] shadow-xl max-w-[300px] w-full border border-orange-100 text-center">
        <div className="text-4xl mb-4">⌛</div>
        <h1 className="text-lg font-black text-gray-900 mb-3 uppercase tracking-tight">Yah, Kehabisan...</h1>
        <p className="text-gray-500 text-[11px] leading-relaxed mb-5">
          Kuota hari ini sudah penuh. Pantau terus Chikumi!
        </p>
        <div className="opacity-20 grayscale relative w-10 h-10 mx-auto">
          <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}