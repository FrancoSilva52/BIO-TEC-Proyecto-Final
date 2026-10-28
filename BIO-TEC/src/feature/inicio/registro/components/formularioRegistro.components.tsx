
import { useState, type FormEvent } from 'react';
import { Alert, Avatar, Button, FileInput, Group, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import '../../../../styles/inicio/registro.css';
import { DatosMedicoDuplicadosError, registrarMedico } from '../services/registro.service';

const PASSWORD_POLICY = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const MAX_PHOTO_FILE_SIZE = 5 * 1024 * 1024;
const MAX_PHOTO_DIMENSION = 512;

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
  reader.readAsDataURL(file);
});

const compressProfilePhoto = async (file: File) => {
  if (!file.type.startsWith('image/')) throw new Error('Seleccioná un archivo de imagen.');
  if (file.size > MAX_PHOTO_FILE_SIZE) throw new Error('La imagen debe pesar menos de 5 MB.');

  const source = await readFileAsDataUrl(file);
  const image = new Image();
  image.src = source;
  await image.decode();

  const scale = Math.min(1, MAX_PHOTO_DIMENSION / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No se pudo preparar la imagen.');

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.78);
};

export const FormularioRegistroComponents = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [area, setArea] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhotoDataUrl, setProfilePhotoDataUrl] = useState('');
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handlePhotoChange = async (file: File | null) => {
    setFormError('');
    if (!file) {
      setProfilePhotoDataUrl('');
      return;
    }

    setIsPhotoProcessing(true);
    try {
      setProfilePhotoDataUrl(await compressProfilePhoto(file));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo procesar la imagen.');
    } finally {
      setIsPhotoProcessing(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (!PASSWORD_POLICY.test(password)) {
      setFormError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registrarMedico({
        nombre,
        apellido,
        dni,
        area,
        telefono,
        email,
        profilePhotoDataUrl,
        password,
      });
      setIsRegistered(true);
    } catch (error) {
      if (error instanceof DatosMedicoDuplicadosError) {
        setFormError(error.message);
      } else {
        console.error('No se pudo registrar el usuario:', error);
        setFormError('No se pudo guardar el registro en la base local. Ejecutá la aplicación con Tauri.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page registration-page">
      <section className="login-card registration-card" aria-labelledby="registration-title">
        <div className="login-brand">
          <span className="login-brand__mark" aria-hidden="true">B</span>
          <div>
            <Text fw={700} size="lg">BIO-TEC</Text>
            <Text size="xs" c="dimmed">Gestión clínica</Text>
          </div>
        </div>

        {isRegistered ? (
          <div className="registration-success">
            <Title id="registration-title" order={2}>Registro completado</Title>
            <Text c="dimmed">Tu usuario médico se guardó en esta computadora.</Text>
            <Button component={Link} to="/login" fullWidth mt="md">
              Ir a iniciar sesión
            </Button>
          </div>
        ) : (
          <>
            <div className="registration-heading">
              <Title id="registration-title" order={2}>Crear usuario médico</Title>
              <Text size="sm" c="dimmed">Los campos marcados con * son obligatorios.</Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap="sm">
                <div className="registration-name-fields">
                  <TextInput label="Nombre *" value={nombre} onChange={(event) => setNombre(event.currentTarget.value)} required autoComplete="given-name" />
                  <TextInput label="Apellido *" value={apellido} onChange={(event) => setApellido(event.currentTarget.value)} required autoComplete="family-name" />
                </div>
                <TextInput label="DNI *" value={dni} onChange={(event) => setDni(event.currentTarget.value)} required autoComplete="off" />
                <TextInput label="Área" placeholder="Ej. Bioquímica" value={area} onChange={(event) => setArea(event.currentTarget.value)} />
                <TextInput label="Número de teléfono *" type="tel" value={telefono} onChange={(event) => setTelefono(event.currentTarget.value)} required autoComplete="tel" />
                <TextInput label="Correo electrónico *" type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} required autoComplete="email" />

                <div className="registration-photo-field">
                  <FileInput
                    label="Foto de perfil"
                    placeholder="Seleccionar imagen (opcional)"
                    accept="image/*"
                    clearable
                    onChange={(file) => void handlePhotoChange(file)}
                    disabled={isPhotoProcessing}
                  />
                  {profilePhotoDataUrl && (
                    <Group gap="sm" className="registration-photo-preview">
                      <Avatar src={profilePhotoDataUrl} alt="Vista previa de la foto" radius="xl" size={52} />
                      <Text size="xs" c="dimmed">Vista previa optimizada</Text>
                    </Group>
                  )}
                </div>

                <PasswordInput
                  label="Contraseña *"
                  value={password}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  required
                  autoComplete="new-password"
                  description="Mínimo 8 caracteres, una mayúscula y un número."
                />
                <PasswordInput
                  label="Confirmar contraseña *"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                  required
                  autoComplete="new-password"
                />

                {formError && <Alert color="red" variant="light" role="alert">{formError}</Alert>}

                <Button type="submit" fullWidth mt="xs" loading={isSubmitting || isPhotoProcessing}>
                  Crear usuario
                </Button>
                <Button component={Link} to="/login" variant="subtle" fullWidth>
                  Volver a iniciar sesión
                </Button>
              </Stack>
            </form>
          </>
        )}
      </section>
    </main>
  );
};
