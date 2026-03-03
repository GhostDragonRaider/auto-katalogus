import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { Car } from '../../api/types';
import { sendContact } from '../../api/client';

const Section = styled.section`
  margin-top: 48px;
  padding: 28px 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 20px 16px;
    margin-top: 32px;
  }
`;

const ContactInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InfoBlock = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const InfoTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #0f172a;
  line-height: 1.5;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #1e293b;
  color: #fff;
  transition: background 0.2s ease;

  &:hover {
    background: #334155;
  }

  &:focus {
    outline: 2px solid #b91c1c;
    outline-offset: 2px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Title = styled.h2`
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
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #b91c1c;
    box-shadow: 0 0 0 2px rgba(185, 28, 28, 0.15);
  }
`;

const Select = styled.select`
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
  color: #0f172a;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s ease;

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
  background: #fff;
  color: #0f172a;
  outline: none;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #b91c1c;
    box-shadow: 0 0 0 2px rgba(185, 28, 28, 0.15);
  }
`;

const FullRow = styled.div`
  grid-column: 1 / -1;
`;

const SubmitRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: #b91c1c;
  color: #fff;
  transition: all 0.2s ease;

  &:hover {
    background: #991b1b;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const Helper = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const StatusText = styled.span<{ $error?: boolean }>`
  font-size: 13px;
  color: ${({ $error }) => ($error ? '#b91c1c' : '#15803d')};
`;

type Props = {
  cars: Car[];
};

const ContactForm: React.FC<Props> = ({ cars }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [carId, setCarId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(undefined);
    if (!name || !email || !message) {
      setStatus({
        type: 'error',
        text: t('contact_error_required'),
      });
      return;
    }
    try {
      setIsSubmitting(true);
      await sendContact({
        name,
        email,
        phone: phone || undefined,
        message,
        car_id: carId || undefined,
      });
      setStatus({
        type: 'success',
        text: t('contact_success'),
      });
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setCarId('');
    } catch (err) {
      setStatus({
        type: 'error',
        text: t('contact_error_send'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <Title id="contact-heading">{t('contact_title')}</Title>
      <Subtitle>{t('contact_subtitle')}</Subtitle>

      <ContactInfoGrid>
        <InfoBlock>
          <InfoTitle>{t('contact_hours_title')}</InfoTitle>
          <InfoText>{t('contact_hours_weekday')}</InfoText>
          <InfoText>{t('contact_hours_saturday')}</InfoText>
          <InfoText>{t('contact_hours_sunday')}</InfoText>
        </InfoBlock>
        <InfoBlock>
          <InfoTitle>{t('contact_address_title')}</InfoTitle>
          <InfoText>{t('contact_address')}</InfoText>
        </InfoBlock>
        <InfoBlock>
          <InfoTitle>{t('contact_social_title')}</InfoTitle>
          <SocialRow>
            <SocialLink
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </SocialLink>
            <SocialLink
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </SocialLink>
            <SocialLink
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </SocialLink>
          </SocialRow>
        </InfoBlock>
      </ContactInfoGrid>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="name">{t('contact_name')}</Label>
          <Input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="email">{t('contact_email')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="phone">{t('contact_phone')}</Label>
          <Input
            id="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="car">{t('contact_car')}</Label>
          <Select
            id="car"
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
          >
            <option value="">{t('contact_car_none')}</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.title}
              </option>
            ))}
          </Select>
          <Helper>{t('contact_car_helper')}</Helper>
        </Field>
        <FullRow>
          <Field>
            <Label htmlFor="message">{t('contact_message')}</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Field>
        </FullRow>

        <SubmitRow>
          {status && (
            <StatusText $error={status.type === 'error'}>
              {status.text}
            </StatusText>
          )}
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('contact_sending') : t('contact_submit')}
          </SubmitButton>
        </SubmitRow>
      </Form>
    </Section>
  );
};

export default ContactForm;
