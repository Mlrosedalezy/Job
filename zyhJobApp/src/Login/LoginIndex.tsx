import React, { useState, useEffect } from 'react';
import UserAPPLogin from './UserAPPLogin';
import PropertyAPPLogin from './PropertyAPPLogin';
import "animate.css";

export default function LoginIndex() {
  const [receivedPhoneNumber, setReceivedPhoneNumber] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePropertyManagementClick = (phoneNumber: string) => {
    setReceivedPhoneNumber(phoneNumber);
    setIsAnimating(true);
    console.log('Received phone number:', receivedPhoneNumber);
    // 在这里可以进行进一步的处理，例如导航到新的页面等
  };

  const handleReturnUserClick = () => {
    setReceivedPhoneNumber('');
    setIsAnimating(true);
    console.log('Returning to user login');
    // 在这里可以进行进一步的处理，例如重置状态等
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000); // 调整这个值以匹配你的动画持续时间

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div>
      {
        receivedPhoneNumber === "accept" ? (
          <div className={`animate__animated ${isAnimating ? 'animate__slideInUp animate__faster' : ''}`} key="property-login">
            <PropertyAPPLogin onReturnUserClick={handleReturnUserClick}></PropertyAPPLogin>
          </div>
        ) : (
          <div className={`animate__animated ${isAnimating ? 'animate__slideInUp animate__faster' : ''}`} key="user-login">
            <UserAPPLogin onPropertyManagementClick={handlePropertyManagementClick}></UserAPPLogin>
          </div>
        )
      }
    </div>
  );
}