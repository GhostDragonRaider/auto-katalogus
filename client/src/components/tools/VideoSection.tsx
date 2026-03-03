import React from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';

const Section = styled.section`
  margin-top: 48px;
  padding: 28px 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  margin: 0 0 24px;
  font-size: 14px;
  color: #64748b;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 20px;
`;

const VideoCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 16 / 9;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const DEMO_VIDEOS = [
  { title: 'Showroom bemutató', url: 'https://www.youtube.com/embed/9xwazD5SyVg' },
  { title: 'Kínálat bemutató', url: 'https://www.youtube.com/embed/9xwazD5SyVg' },
];

const VideoSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Section>
      <Title>{t('video_section_title')}</Title>
      <Subtitle>{t('video_section_subtitle')}</Subtitle>
      <Grid>
        {DEMO_VIDEOS.map((v, i) => (
          <VideoCard key={i}>
            <iframe src={v.url} title={v.title} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          </VideoCard>
        ))}
      </Grid>
    </Section>
  );
};

export default VideoSection;
