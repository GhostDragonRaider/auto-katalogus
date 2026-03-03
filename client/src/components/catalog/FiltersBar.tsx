import React from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';

const Wrapper = styled.section`
  margin-bottom: 24px;
  padding: 20px 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Title = styled.h3`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 2px solid #b91c1c;
  padding-bottom: 6px;
  display: inline-block;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-items: flex-end;
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
  flex: 1;
  max-width: 200px;

  @media (max-width: 480px) {
    min-width: 100%;
    max-width: none;
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
  background: #fff;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #b91c1c;
    box-shadow: 0 0 0 2px rgba(185, 28, 28, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
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

const SearchButton = styled.button`
  padding: 10px 24px;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: #991b1b;
  }
`;

const ClearLink = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: #b91c1c;
  }
`;

type Props = {
  makes: string[];
  make: string;
  onMakeChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  colors: string[];
  color: string;
  onColorChange: (value: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  minPower: string;
  maxPower: string;
  onMinPowerChange: (value: string) => void;
  onMaxPowerChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  resultCount?: number;
  onClear?: () => void;
};

const FiltersBar: React.FC<Props> = ({
  makes,
  make,
  onMakeChange,
  category,
  onCategoryChange,
  colors,
  color,
  onColorChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minPower,
  maxPower,
  onMinPowerChange,
  onMaxPowerChange,
  sort,
  onSortChange,
  resultCount,
  onClear,
}) => {
  const { t } = useLanguage();
  return (
    <Wrapper>
      <Title>{t('filter_title')}</Title>

      <Row>
        <FieldGroup>
          <Label htmlFor="make">{t('filter_make')}</Label>
          <Select
            id="make"
            value={make}
            onChange={(e) => onMakeChange(e.target.value)}
          >
            <option value="">{t('filter_make_all')}</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="category">{t('filter_category')}</Label>
          <Select
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">{t('filter_category_all')}</option>
            <option value="Prémium">Prémium</option>
            <option value="SUV">SUV</option>
            <option value="Családi">Családi</option>
          </Select>
        </FieldGroup>

        {colors.length > 0 && (
          <FieldGroup>
            <Label htmlFor="color">{t('filter_color')}</Label>
            <Select id="color" value={color} onChange={(e) => onColorChange(e.target.value)}>
              <option value="">{t('filter_color_all')}</option>
              {colors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FieldGroup>
        )}

        <FieldGroup>
          <Label htmlFor="sort">{t('filter_sort')}</Label>
          <Select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">{t('filter_sort_default')}</option>
            <option value="price_asc">{t('filter_sort_price_asc')}</option>
            <option value="price_desc">{t('filter_sort_price_desc')}</option>
            <option value="date_desc">{t('filter_sort_date_desc')}</option>
            <option value="date_asc">{t('filter_sort_date_asc')}</option>
          </Select>
        </FieldGroup>
      </Row>

      <Row>
        <FieldGroup>
          <Label htmlFor="minPrice">{t('filter_price_min')}</Label>
          <Input
            id="minPrice"
            type="number"
            min={0}
            placeholder="0"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="maxPrice">{t('filter_price_max')}</Label>
          <Input
            id="maxPrice"
            type="number"
            min={0}
            placeholder="—"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="minPower">{t('filter_power_min')}</Label>
          <Input
            id="minPower"
            type="number"
            min={0}
            placeholder="0"
            value={minPower}
            onChange={(e) => onMinPowerChange(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="maxPower">{t('filter_power_max')}</Label>
          <Input
            id="maxPower"
            type="number"
            min={0}
            placeholder="—"
            value={maxPower}
            onChange={(e) => onMaxPowerChange(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup style={{ maxWidth: 'none', flex: '0 0 auto' }}>
          <SearchButton type="button" tabIndex={-1}>
            {resultCount != null ? t('filter_search_count', resultCount) : t('filter_search')}
          </SearchButton>
        </FieldGroup>
      </Row>

      {onClear && (
        <Row>
          <ClearLink type="button" onClick={onClear}>
            {t('filter_clear')}
          </ClearLink>
        </Row>
      )}
    </Wrapper>
  );
};

export default FiltersBar;
