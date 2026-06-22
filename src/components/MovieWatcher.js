'use client'; // Đây là lệnh để Next.js biết cái này chạy trên máy anh yêu

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MovieWatcher({ slug, movieName, epName, epIndex, thumb }) {
  const router = useRouter();

  useEffect(() => {
    // 1. Lưu lịch sử mỗi khi anh đổi tập phim
    const history = JSON.parse(localStorage.getItem('ck_thu_uyn_history') || '{}');
    history[slug] = {
      name: movieName,
      lastEp: epName,
      lastIndex: epIndex,
      thumb: thumb, // Lưu ảnh bìa vào đây
      time: new Date().toLocaleString(),
      url: `/watch/${slug}?ep=${epIndex}`
    };
    localStorage.setItem('ck_thu_uyn_history', JSON.stringify(history));

    // 2. Kiểm tra xem có phim nào khác đang xem dở không để nhắc anh
    // (Em làm cái này chạy ở Trang Chủ thì hay hơn, nhưng tạm để đây cho anh dễ hình dung)
  }, [slug, epIndex]);

  return null; // Cái này không hiện ra gì cả, nó chỉ âm thầm làm việc thôi
}