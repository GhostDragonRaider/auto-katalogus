import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { subscribeNotify } from '../../api/client';

const Section = styled.section`
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 24px;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  color: #64748b;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;

  @media (max-width: 480px) {
    min-width: 100%;
  }
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

const Select = styled.select`
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;

  &:focus {
    border-color: #b91c1c;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
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
  width: 100%;
`;

type Props = {
  makes: string[];
  defaultMake?: string;
  defaultCategory?: string;
};

const NotifyForm: React.FC<Props> = ({ makes, defaultMake = '', defaultCategory = '' }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [make, setMake] = useState(defaultMake);
  const [category, setCategory] = useState(defaultCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(undefined);
    if (!email) return;
    try {
      setIsSubmitting(true);
      await subscribeNotify({
        email,
        make: make || undefined,
        category: category || undefined,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
      });
      setStatus({ type: 'success', text: t('notify_success') });
      setEmail('');
    } catch {
      setStatus({ type: 'error', text: t('contact_error_send') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <Title>{t('notify_title')}</Title>
      <Subtitle>{t('notify_subtitle')}</Subtitle>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label>{t('notify_email')}</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field>
          <Label>{t('filter_make')}</Label>
          <Select value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">{t('filter_make_all')}</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label>{t('filter_category')}</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">{t('filter_category_all')}</option>
            <option value="Prémium">Prémium</option>
            <option value="SUV">SUV</option>
            <option value="Családi">Családi</option>
          </Select>
        </Field>
        <Field>
          <Label>{t('filter_price_min')}</Label>
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field>
          <Label>{t('filter_price_max')}</Label>
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="—"
          />
        </Field>
        <Button type="submit" disabled={isSubmitting}>
          {t('notify_submit')}
        </Button>
        {status && <Status $error={status.type === 'error'}>{status.text}</Status>}
      </Form>
    </Section>
  );
};

export default NotifyForm;
