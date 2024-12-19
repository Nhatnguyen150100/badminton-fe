import React, { useEffect, useState } from 'react';
import { Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function PaymentError() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
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
        status="error"
        title="Bạn đã thanh toán thất bại!"
        subTitle={`Bạn sẽ được chuyển về trang chủ sau ${countdown} giây.`}
      />
    </div>
  );
}
