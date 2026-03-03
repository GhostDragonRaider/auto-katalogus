import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

const Page = styled.article`
  max-width: 720px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: 0 4px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 24px;
  border-bottom: 3px solid #b91c1c;
  padding-bottom: 12px;
  display: inline-block;

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const Intro = styled.p`
  font-size: 17px;
  line-height: 1.65;
  color: #334155;
  margin: 0 0 32px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px;
`;

const SectionText = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #475569;
  margin: 0;
`;

const ValuesGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 16px;
`;

const ValueCard = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ValueTitle = styled.strong`
  display: block;
  font-size: 15px;
  color: #15803d;
  margin-bottom: 4px;
`;

const ValueText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CtaButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: #b91c1c;
    color: #fff;
    &:hover {
      background: #991b1b;
    }
  }

  &.secondary {
    background: #f1f5f9;
    color: #334155;
    &:hover {
      background: #e2e8f0;
    }
  }
`;

const AboutPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{t('about_meta_title')}</title>
        <meta
          name="description"
          content={lang === 'hu' ? 'A NovaDrive Motors autókereskedés bemutatkozása: küldetésünk, értékeink, minőség és átláthatóság.' : 'About NovaDrive Motors car dealership: our mission, values, quality and transparency.'}
        />
      </Helmet>

      <Page>
        <Title>{t('about_title')}</Title>
        <Intro>{t('about_intro')}</Intro>

        <Section>
          <SectionTitle>{t('about_mission_title')}</SectionTitle>
          <SectionText>{t('about_mission')}</SectionText>
        </Section>

        <Section>
          <SectionTitle>{t('about_values_title')}</SectionTitle>
          <ValuesGrid>
            <ValueCard>
              <ValueTitle>✓ {t('about_value_quality_title')}</ValueTitle>
              <ValueText>{t('about_value_quality')}</ValueText>
            </ValueCard>
            <ValueCard>
              <ValueTitle>✓ {t('about_value_transparency_title')}</ValueTitle>
              <ValueText>{t('about_value_transparency')}</ValueText>
            </ValueCard>
            <ValueCard>
              <ValueTitle>✓ {t('about_value_service_title')}</ValueTitle>
              <ValueText>{t('about_value_service')}</ValueText>
            </ValueCard>
          </ValuesGrid>
        </Section>

        <CtaRow>
          <CtaButton
            type="button"
            className="primary"
            onClick={() => navigate('/', { state: { scrollTo: 'inventory' } })}
          >
            {t('nav_inventory')}
          </CtaButton>
          <CtaButton
            type="button"
            className="secondary"
            onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
          >
            {t('nav_contact')}
          </CtaButton>
        </CtaRow>
      </Page>
    </>
  );
};

export default AboutPage;
