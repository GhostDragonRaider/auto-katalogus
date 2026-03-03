import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { sendContact } from '../../api/client';

const Section = styled.section`
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 2px solid #b91c1c;
  padding-bottom: 6px;
  display: inline-block;
`;

const Subtitle = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  color: #64748b;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #475569;
`;

const Input = styled.input`
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  font-size: 14px;

  &:focus {
    border-color: #b91c1c;
    outline: none;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #991b1b;
  }
  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;

const Status = styled.p<{ $error?: boolean }>`
  margin: 0;
  font-size: 13px;
  color: ${({ $error }) => ($error ? '#b91c1c' : '#15803d')};
`;

const TradeInForm: React.FC = () => {
  const { t } = useLanguage();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(undefined);
    if (!name || !email || !make || !model) return;
    const msg = `Csereautó értékbecslés: Márka: ${make}, Modell: ${model}, Év: ${year}, Km: ${mileage}`;
    try {
      setIsSubmitting(true);
      await sendContact({ name, email, phone: phone || undefined, message: msg, type: 'trade_in' });
      setStatus({ type: 'success', text: t('tradein_success') });
      setMake('');
      setModel('');
      setYear('');
      setMileage('');
      setName('');
      setEmail('');
      setPhone('');
    } catch {
      setStatus({ type: 'error', text: t('contact_error_send') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <Title>{t('tradein_title')}</Title>
      <Subtitle>{t('tradein_subtitle')}</Subtitle>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Field>
            <Label>{t('tradein_make')}</Label>
            <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder={t('tradein_placeholder_make')} required />
          </Field>
          <Field>
            <Label>{t('tradein_model')}</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder={t('tradein_placeholder_model')} required />
          </Field>
        </Row>
        <Row>
          <Field>
            <Label>{t('tradein_year')}</Label>
            <Input type="number" min={1990} max={new Date().getFullYear() + 1} value={year} onChange={(e) => setYear(e.target.value)} />
          </Field>
          <Field>
            <Label>{t('tradein_mileage')}</Label>
            <Input type="number" min={0} value={mileage} onChange={(e) => setMileage(e.target.value)} />
          </Field>
        </Row>
        <Field>
          <Label>{t('contact_name')}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field>
          <Label>{t('contact_email')}</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field>
          <Label>{t('contact_phone')}</Label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        {status && <Status $error={status.type === 'error'}>{status.text}</Status>}
        <Button type="submit" disabled={isSubmitting}>{t('tradein_submit')}</Button>
      </Form>
    </Section>
  );
};

export default TradeInForm;
