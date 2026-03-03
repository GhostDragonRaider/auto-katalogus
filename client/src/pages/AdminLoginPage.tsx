import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { adminLogin } from '../api/client';

const Card = styled.section`
  max-width: 420px;
  margin: 32px auto 0;
  padding: 28px 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 3px solid #b91c1c;
  padding-bottom: 6px;
  display: inline-block;
`;

const Subtitle = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #475569;
`;

const Input = styled.input`
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #b91c1c;
    box-shadow: 0 0 0 2px rgba(185, 28, 28, 0.15);
  }
`;

const Helper = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  color: #64748b;
`;

const SubmitButton = styled.button`
  margin-top: 4px;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: #b91c1c;
  color: #fff;
  transition: background 0.2s ease;

  &:hover {
    background: #991b1b;
  }

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;

const ErrorText = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #b91c1c;
`;

const AdminLoginPage: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setIsSubmitting(true);
      const res = await adminLogin(email, password);
      localStorage.setItem('nd_admin_token', res.token);
      navigate('/admin');
    } catch (err) {
      const msg =
        err instanceof Error && err.message?.includes('fetch')
          ? t('admin_error_connection')
          : t('admin_error_credentials');
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('site_name')} | {t('admin_login_title')}</title>
        <meta
          name="description"
          content="NovaDrive demo autókereskedés admin felület – belépés a készlet és megkeresések kezeléséhez."
        />
      </Helmet>

      <Card>
        <Title>{t('admin_login_title')}</Title>
        <Subtitle>
          {t('admin_login_subtitle')}{' '}
          <strong>admin@example.com</strong> / <strong>admin</strong>{' '}
          {t('admin_login_subtitle2')}
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="email">{t('admin_email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <Label htmlFor="password">{t('admin_password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Helper>{t('admin_demo')}</Helper>
          </Field>

          {error && <ErrorText>{error}</ErrorText>}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('admin_submitting') : t('admin_submit')}
          </SubmitButton>
        </Form>
      </Card>
    </>
  );
};

export default AdminLoginPage;

