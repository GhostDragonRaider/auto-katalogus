import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

const Wrapper = styled.main`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
`;

const Code = styled.p`
  font-size: 72px;
  font-weight: 800;
  color: #b91c1c;
  margin: 0 0 16px;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 56px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Message = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0 0 24px;
  max-width: 400px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: #991b1b;
  }

  &:focus {
    outline: 2px solid #b91c1c;
    outline-offset: 2px;
  }
`;

const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('notfound_title')} | {t('site_name')}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <Wrapper role="main" aria-labelledby="notfound-title">
        <Code aria-hidden>404</Code>
        <Title id="notfound-title">{t('notfound_title')}</Title>
        <Message>{t('notfound_message')}</Message>
        <BackLink to="/">{t('notfound_back')}</BackLink>
      </Wrapper>
    </>
  );
};

export default NotFoundPage;
