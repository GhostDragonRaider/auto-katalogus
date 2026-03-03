import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useLanguage } from '../../context/LanguageContext';
import { Car } from '../../api/types';
import {
  adminFetchCars,
  adminCreateCar,
  adminUpdateCar,
  adminDeleteCar,
  adminUploadImages,
  AdminCarPayload,
} from '../../api/client';

const Panel = styled.section`
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

const Count = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const AddButton = styled.button`
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  background: #b91c1c;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background: #991b1b;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
  background: #f8fafc;
`;

const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
`;

const Tag = styled.span`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #f1f5f9;
  color: #475569;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionButton = styled.button<{ $variant?: 'danger' | 'ghost' }>`
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  ${({ $variant }) =>
    $variant === 'danger'
      ? `
    background: #fef2f2;
    color: #b91c1c;
  `
      : `
    background: #f1f5f9;
    color: #475569;
  `}
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 540px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

const ModalForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #475569;
`;

const Input = styled.input`
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  font-size: 13px;
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
  padding: 8px 12px;
  font-size: 13px;
  background: #fff;
  color: #0f172a;
  outline: none;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    border-color: #b91c1c;
    box-shadow: 0 0 0 2px rgba(185, 28, 28, 0.15);
  }
`;

const FullRow = styled.div`
  grid-column: 1 / -1;
`;

const ModalActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const StatusText = styled.p`
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
`;

const FileUploadZone = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #f8fafc;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #b91c1c;
    background: #fef2f2;
  }

  input {
    display: none;
  }
`;

const FileUploadText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #64748b;
`;

const ImagePreviews = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageOrderBadge = styled.span`
  position: absolute;
  bottom: 2px;
  left: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
`;

type Props = {
  token: string;
};

const AdminCarsPanel: React.FC<Props> = ({ token }) => {
  const { t } = useLanguage();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState<Partial<AdminCarPayload>>({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel_type: 'Benzin',
    transmission: 'Automata',
    body_type: 'Sedan',
    category: 'Prémium',
    main_image: '',
    gallery: [],
    description: '',
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadCars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminFetchCars(token);
      setCars(data);
    } catch (err) {
      setError(t('admin_cars_error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openCreateModal = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm({
      title: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuel_type: 'Benzin',
      transmission: 'Automata',
      body_type: 'Sedan',
      category: 'Prémium',
      main_image: '',
      gallery: [],
      description: '',
      color: '',
      power_hp: undefined,
      video_url: '',
      extras: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setIsEdit(true);
    setEditingId(car.id);
    setForm({
      ...car,
      gallery: car.gallery ?? [],
    });
    setIsModalOpen(true);
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      setIsUploading(true);
      const urls = await adminUploadImages(token, files);
      if (urls.length > 0) {
        setForm((prev) => {
          const newGallery = [...(prev.gallery ?? []), ...urls];
          return {
            ...prev,
            main_image: prev.main_image || urls[0],
            gallery: newGallery,
          };
        });
      }
    } catch {
      // ignore
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(Array.from(files));
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length > 0) await uploadFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (field: keyof AdminCarPayload, value: string) => {
    if (field === 'year' || field === 'price' || field === 'mileage' || field === 'power_hp') {
      setForm((prev) => ({ ...prev, [field]: value === '' ? undefined : Number(value) }));
    } else if (field === 'gallery') {
      const list = value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      setForm((prev) => ({
        ...prev,
        gallery: list,
        main_image: list[0] ?? prev.main_image ?? '',
      }));
    } else if (field === 'extras') {
      const list = value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      setForm((prev) => ({ ...prev, extras: list }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (isEdit && editingId) {
        await adminUpdateCar(token, editingId, form);
      } else {
        await adminCreateCar(token, form as AdminCarPayload);
      }
      setIsModalOpen(false);
      await loadCars();
    } catch (err) {
      // keeping it simple for demo
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSold = async (car: Car) => {
    try {
      await adminUpdateCar(token, car.id, { is_sold: !car.is_sold });
      await loadCars();
    } catch {
      // ignore
    }
  };

  const handleDelete = async (car: Car) => {
    if (!window.confirm(`${t('admin_cars_confirm_delete')} ${car.title}?`)) return;
    try {
      await adminDeleteCar(token, car.id);
      await loadCars();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <Panel>
        <Header>
          <div>
            <Title>{t('admin_cars_title')}</Title>
            <Count>{t('admin_cars_count', cars.length)}</Count>
          </div>
          <AddButton type="button" onClick={openCreateModal}>
            {t('admin_cars_add')}
          </AddButton>
        </Header>

        {isLoading && <StatusText>{t('admin_cars_loading')}</StatusText>}
        {error && <StatusText>{error}</StatusText>}

        {!isLoading && !error && (
          <Table>
            <thead>
              <tr>
                <Th>{t('admin_cars_col_car')}</Th>
                <Th>{t('admin_cars_col_price')}</Th>
                <Th>{t('admin_cars_col_category')}</Th>
                <Th>{t('admin_cars_col_status')}</Th>
                <Th>{t('admin_cars_col_actions')}</Th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <Td>
                    <div style={{ fontWeight: 500 }}>{car.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {car.make} · {car.model} · {car.year}
                    </div>
                  </Td>
                  <Td>{car.price.toLocaleString('hu-HU')} Ft</Td>
                  <Td>
                    <Tag>{car.category}</Tag>
                  </Td>
                  <Td>
                    <Tag>{car.is_sold ? t('admin_cars_status_sold') : t('admin_cars_status_active')}</Tag>
                  </Td>
                  <Td>
                    <Actions>
                      <ActionButton type="button" onClick={() => openEditModal(car)}>
                        {t('admin_cars_edit')}
                      </ActionButton>
                      <ActionButton
                        type="button"
                        onClick={() => toggleSold(car)}
                      >
                        {car.is_sold ? t('admin_cars_reactivate') : t('admin_cars_sold')}
                      </ActionButton>
                      <ActionButton
                        type="button"
                        $variant="danger"
                        onClick={() => handleDelete(car)}
                      >
                        {t('admin_cars_delete')}
                      </ActionButton>
                    </Actions>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>

      {isModalOpen && (
        <ModalBackdrop>
          <Modal>
            <ModalTitle>
              {isEdit ? t('admin_cars_modal_edit') : t('admin_cars_modal_add')}
            </ModalTitle>
            <ModalForm onSubmit={handleSubmit}>
              <Field>
                <Label>{t('admin_cars_label_title')}</Label>
                <Input
                  value={form.title ?? ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_label_make')}</Label>
                <Input
                  value={form.make ?? ''}
                  onChange={(e) => handleChange('make', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_label_model')}</Label>
                <Input
                  value={form.model ?? ''}
                  onChange={(e) => handleChange('model', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_label_year')}</Label>
                <Input
                  type="number"
                  value={form.year ?? new Date().getFullYear()}
                  onChange={(e) => handleChange('year', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_col_price')}</Label>
                <Input
                  type="number"
                  value={form.price ?? 0}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_label_mileage')}</Label>
                <Input
                  type="number"
                  value={form.mileage ?? 0}
                  onChange={(e) => handleChange('mileage', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_label_fuel')}</Label>
                <Input
                  value={form.fuel_type ?? ''}
                  onChange={(e) => handleChange('fuel_type', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_label_transmission')}</Label>
                <Input
                  value={form.transmission ?? ''}
                  onChange={(e) => handleChange('transmission', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_label_body')}</Label>
                <Input
                  value={form.body_type ?? ''}
                  onChange={(e) => handleChange('body_type', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('admin_cars_label_category')}</Label>
                <Input
                  value={form.category ?? ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t('car_color')}</Label>
                <Input
                  value={form.color ?? ''}
                  onChange={(e) => handleChange('color', e.target.value)}
                  placeholder="pl. Fehér"
                />
              </Field>
              <Field>
                <Label>{t('car_power')}</Label>
                <Input
                  type="number"
                  value={form.power_hp ?? ''}
                  onChange={(e) => handleChange('power_hp', e.target.value)}
                  placeholder="LE"
                />
              </Field>
              <FullRow>
                <Field>
                  <Label>Videó URL</Label>
                  <Input
                    value={form.video_url ?? ''}
                    onChange={(e) => handleChange('video_url', e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </Field>
              </FullRow>
              <FullRow>
                <Field>
                  <Label>{t('admin_cars_label_images')}</Label>
                  <FileUploadZone
                    onClick={() =>
                      (document.getElementById('car-image-upload') as HTMLInputElement)?.click()
                    }
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      id="car-image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      multiple
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                    <FileUploadText>
                      {isUploading
                        ? t('admin_cars_uploading')
                        : t('admin_cars_upload_text')}
                    </FileUploadText>
                  </FileUploadZone>
                  {(form.main_image || (form.gallery ?? []).length > 0) && (
                    <ImagePreviews>
                      {((form.gallery ?? []).length > 0
                        ? (form.gallery ?? [])
                        : form.main_image
                          ? [form.main_image]
                          : []
                      ).map((url, i) => (
                        <ImagePreview key={url}>
                          <img src={url} alt="" />
                          <ImageOrderBadge>
                            {i === 0 ? t('admin_cars_main_image') : i + 1}
                          </ImageOrderBadge>
                        </ImagePreview>
                      ))}
                    </ImagePreviews>
                  )}
                </Field>
              </FullRow>
              <FullRow>
                <Field>
                  <Label>{t('admin_cars_label_urls')}</Label>
                  <Input
                    placeholder="https://..."
                    value={(form.gallery ?? []).join(', ')}
                    onChange={(e) => handleChange('gallery', e.target.value)}
                  />
                </Field>
              </FullRow>
              <FullRow>
                <Field>
                  <Label>{t('admin_cars_label_extras')}</Label>
                  <Input
                    value={(form.extras ?? []).join(', ')}
                    onChange={(e) => handleChange('extras', e.target.value)}
                    placeholder="pl. Klimatizált, Bőr belső, GPS"
                  />
                </Field>
              </FullRow>
              <FullRow>
                <Field>
                  <Label>{t('admin_cars_label_description')}</Label>
                  <Textarea
                    value={form.description ?? ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </Field>
              </FullRow>
              <ModalActions>
                <ActionButton
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  {t('admin_cars_cancel')}
                </ActionButton>
                <AddButton type="submit" disabled={isSaving}>
                  {isSaving ? t('admin_cars_saving') : t('admin_cars_save')}
                </AddButton>
              </ModalActions>
            </ModalForm>
          </Modal>
        </ModalBackdrop>
      )}
    </>
  );
};

export default AdminCarsPanel;

