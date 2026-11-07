import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site-config';

// Ảnh OpenGraph mặc định (1200×630) sinh lúc build, dùng khi share link lên Facebook/Zalo/Slack
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 36, marginTop: 24, opacity: 0.9 }}>Try products before you buy</div>
      </div>
    ),
    size,
  );
}
