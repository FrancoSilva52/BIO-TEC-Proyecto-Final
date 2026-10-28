import { Button } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/shared/backButton.css';

type BackButtonComponentProps = {
  fallbackTo: string;
  label?: string;
};

export const BackButtonComponent = ({
  fallbackTo,
  label = 'Volver',
}: BackButtonComponentProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    const historyIndex = window.history.state?.idx;
    if (typeof historyIndex === 'number' && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
  };

  return (
    <Button
      type="button"
      variant="subtle"
      leftSection={<ArrowLeft size={16} aria-hidden="true" />}
      className="app-back-button"
      onClick={handleBack}
    >
      {label}
    </Button>
  );
};
