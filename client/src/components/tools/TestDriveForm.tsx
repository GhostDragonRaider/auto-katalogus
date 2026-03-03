import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { bookTestDrive } from '../../api/client';
import { Car } from '../../api/types';

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

const Textarea = styled.textarea`
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  font-size: 14px;
  min-height: 60px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    border-color: #b91c1c;
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

type Props = { car: Car };

const TestDriveForm: React.FC<Props> = ({ car }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(undefined);
    if (!name || !email || !phone || !preferredDate || !preferredTime) return;
    try {
      setIsSubmitting(true);
      await bookTestDrive({
        car_id: car.id,
        name,
        email,
        phone,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message: message || undefined,
      });
      setStatus({ type: 'success', text: t('testdrive_success') });
      setName('');
      setEmail('');
      setPhone('');
      setPreferredDate('');
      setPreferredTime('');
      setMessage('');
    } catch {
      setStatus({ type: 'error', text: t('testdrive_error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label>{t('testdrive_name')}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field>
        <Label>{t('testdrive_email')}</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field>
        <Label>{t('testdrive_phone')}</Label>
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </Field>
      <Field>
        <Label>{t('testdrive_date')}</Label>
        <Input
          type="date"
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          required
        />
      </Field>
      <Field>
        <Label>{t('testdrive_time')}</Label>
        <Input
          type="time"
          value={preferredTime}
          onChange={(e) => setPreferredTime(e.target.value)}
          required
        />
      </Field>
      <Field>
        <Label>{t('testdrive_message')}</Label>
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </Field>
      {status && <Status $error={status.type === 'error'}>{status.text}</Status>}
      <Button type="submit" disabled={isSubmitting}>
        {t('testdrive_submit')}
      </Button>
    </Form>
  );
};

export default TestDriveForm;
