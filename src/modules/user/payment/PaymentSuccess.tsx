import React, { useEffect, useState } from 'react';
import { Result } from 'antd';
import { DEFINE_ROUTERS_USER } from '../../../constants/routers-mapper';
export default function PaymentSuccess() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.open(DEFINE_ROUTERS_USER.home);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 w-full">
      <Result
        status="success"
        title="Bạn đã thanh toán thành công!"
        subTitle={`Bạn sẽ được chuyển về trang chủ sau ${countdown} giây.`}
      />
    </div>
  );
}
