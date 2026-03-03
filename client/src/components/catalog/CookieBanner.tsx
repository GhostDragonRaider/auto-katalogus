import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';

const STORAGE_KEY = 'nd_cookie_consent';

const Wrapper = styled.aside`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 20px;
  background: #1e293b;
  color: #fff;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`;

const Inner = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  box-sizing: border-box;
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  flex: 1;
  min-width: 0;

  @media (max-width: 480px) {
    font-size: 13px;
    min-width: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(p) =>
    p.$primary
      ? `
    background: #b91c1c;
    color: #fff;
    &:hover { background: #991b1b; }
  `
      : `
    background: rgba(255,255,255,0.15);
    color: #fff;
    &:hover { background: rgba(255,255,255,0.25); }
  `}

  &:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const CookieBanner: React.FC = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== 'accepted') {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const showDetails = () => {
    window.location.href = '/about';
  };

  if (!visible) return null;

  return (
    <Wrapper role="dialog" aria-label={t('cookie_title')} aria-describedby="cookie-desc">
      <Inner>
        <div>
          <Text id="cookie-desc">{t('cookie_message')}</Text>
        </div>
        <Buttons>
          <Button type="button" onClick={showDetails} aria-label={t('cookie_more')}>
            {t('cookie_more')}
          </Button>
          <Button type="button" $primary onClick={accept} aria-label={t('cookie_accept')}>
            {t('cookie_accept')}
          </Button>
        </Buttons>
      </Inner>
    </Wrapper>
  );
};

export default CookieBanner;
