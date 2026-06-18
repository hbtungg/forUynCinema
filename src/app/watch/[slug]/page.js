import WatchClient from './WatchClient';

// Server fetch thẳng phim.nguonc.com luôn bị Cloudflare chặn
// → bỏ hẳn, để WatchClient tự fetch từ browser
export async function generateMetadata({ params }) {
  const { slug } = await params;
  // Tên phim sẽ được cập nhật bởi WatchClient sau khi fetch xong
  return { title: `Loading... - Uynflix` };
}

export default async function WatchPage({ params }) {
  const { slug } = await params;
  return <WatchClient slug={slug} />;
}