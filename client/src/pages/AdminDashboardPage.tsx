import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AdminCarsPanel from '../components/admin/AdminCarsPanel';
import AdminMessagesPanel from '../components/admin/AdminMessagesPanel';
import AdminCallbacksPanel from '../components/admin/AdminCallbacksPanel';
import AdminChatPanel from '../components/admin/AdminChatPanel';

const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const SecondRow = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Header = styled.div`
  margin-bottom: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #64748b;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LogoutButton = styled.button`
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const AdminDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('nd_admin_token');
    if (!stored) {
      navigate('/admin/login');
    } else {
      setToken(stored);
    }
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem('nd_admin_token');
    navigate('/admin/login');
  };

  if (!token) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{t('site_name')} admin felület</title>
      </Helmet>

      <TopBar>
        <Header>
          <Title>{t('admin_dash_title')}</Title>
          <Subtitle>{t('admin_dash_subtitle')}</Subtitle>
        </Header>
        <LogoutButton type="button" onClick={logout}>
          {t('admin_logout')}
        </LogoutButton>
      </TopBar>

      <Layout>
        <AdminCarsPanel token={token} />
        <AdminMessagesPanel token={token} />
        <SecondRow>
          <AdminCallbacksPanel token={token} />
          <AdminChatPanel token={token} />
        </SecondRow>
      </Layout>
    </>
  );
};

export default AdminDashboardPage;

