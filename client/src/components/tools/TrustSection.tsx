import React from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';

const Section = styled.section`
  padding: 32px 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  margin-top: 32px;
`;

const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  border-bottom: 3px solid #b91c1c;
  padding-bottom: 8px;
  display: inline-block;
  width: 100%;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
`;

const Number = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #b91c1c;
  margin-bottom: 4px;
`;

const Label = styled.div`
  font-size: 14px;
  color: #475569;
  font-weight: 500;
`;

const Testimonial = styled.blockquote`
  margin: 24px 0 0;
  padding: 20px;
  background: #f1f5f9;
  border-radius: 8px;
  border-left: 4px solid #b91c1c;
  font-size: 14px;
  font-style: italic;
  color: #475569;
`;

const TrustSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Section>
      <Title>{t('trust_title')}</Title>
      <Grid>
        <Card>
          <Number>500+</Number>
          <Label>{t('trust_sold', 500)}</Label>
        </Card>
        <Card>
          <Number>15+</Number>
          <Label>{t('trust_years', 15)}</Label>
        </Card>
        <Card>
          <Number>4.8</Number>
          <Label>Google értékelés</Label>
        </Card>
        <Card>
          <Number>✓</Number>
          <Label>{t('trust_guarantee')}</Label>
        </Card>
      </Grid>
      <Testimonial>
        „Professzionális, gyors és korrekt ügyintézés. Mindenképpen ajánlom!” – K. Tamás
      </Testimonial>
    </Section>
  );
};

export default TrustSection;
