import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MainImageWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: #f1f5f9;
  aspect-ratio: 16 / 10;
  border: 1px solid #e2e8f0;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ThumbnailsRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const Thumbnail = styled.button<{ $active?: boolean }>`
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid
    ${({ $active }) => ($active ? '#b91c1c' : '#e2e8f0')};
  padding: 0;
  background: transparent;
  cursor: pointer;
  flex: 0 0 100px;
  height: 66px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const VideoWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: #000;
  margin-bottom: 12px;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

type Props = {
  images: string[];
  title: string;
  videoUrl?: string;
};

const Gallery: React.FC<Props> = ({ images, title, videoUrl }) => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const safeIndex = Math.min(index, images.length - 1);

  const embedUrl = videoUrl?.includes('youtube.com')
    ? videoUrl.replace('watch?v=', 'embed/').split('&')[0]
    : videoUrl?.includes('youtu.be')
      ? `https://www.youtube.com/embed/${videoUrl.split('/').pop()}`
      : videoUrl;

  return (
    <Wrapper>
      {embedUrl && (
        <VideoWrapper>
          <iframe src={embedUrl} title={`${title} video`} allowFullScreen />
        </VideoWrapper>
      )}
      <MainImageWrapper>
        <MainImage src={images[safeIndex]} alt={title} />
      </MainImageWrapper>
      {images.length > 1 && (
        <ThumbnailsRow aria-label={t('car_gallery_aria')}>
          {images.map((src, i) => (
            <Thumbnail
              key={src + i.toString()}
              onClick={() => setIndex(i)}
              $active={i === safeIndex}
            >
              <img src={src} alt={t('car_image_alt', title, i + 1)} loading="lazy" />
            </Thumbnail>
          ))}
        </ThumbnailsRow>
      )}
    </Wrapper>
  );
};

export default Gallery;
