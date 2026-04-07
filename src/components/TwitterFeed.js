'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function TwitterFeed() {
  
  // Tự động quét lại widget khi trang web đã sẵn sàng
  useEffect(() => {
    if (window.twttr && typeof window.twttr.widgets.load === 'function') {
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <section className="mt-24 mb-32 max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.4em]">
          X • News Feed
        </h2>
      </div>
      
      <div className="rounded-[2.5rem] overflow-hidden border border-zinc-900 bg-zinc-950/30 backdrop-blur-sm p-4 min-h-[450px] flex flex-col items-center justify-center relative">
        <a 
          className="twitter-timeline" 
          data-theme="dark" 
          data-chrome="noheader nofooter noborders transparent"
          data-tweet-limit="3"
          href="https://twitter.com/Linhcun123?ref_src=twsrc%5Etfw"
        >
          {/* Màn hình loading dự phòng */}
          <div className="py-20 text-center text-zinc-800 font-black uppercase text-[10px] tracking-[0.2em] animate-pulse">
            Đang kết nối tới bản tin của Linh...
          </div>
        </a>

        <Script 
          src="https://platform.twitter.com/widgets.js" 
          strategy="lazyOnload"
          onLoad={() => {
            if (window.twttr) {
              window.twttr.widgets.load();
            }
          }}
        />
      </div>
    </section>
  );
}