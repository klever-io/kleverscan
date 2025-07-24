import { PropsWithChildren, useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import {
  CardContainer,
  DropZone,
  ErrorMessage,
  IconContainer,
  Input,
  Message,
  TitleContainer,
  UploadIcon,
} from './styles';

export interface IDropFileCardProps {
  id?: string;
  title?: string;
  message?: string;
  accept?: string;
  error?: string;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DropFileCard: React.FC<PropsWithChildren<IDropFileCardProps>> = ({
  id,
  title,
  message,
  accept,
  error,
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <CardContainer>
      {title && (
        <TitleContainer>
          <span>{title}</span>
        </TitleContainer>
      )}

      <DropZone
        isDragging={isDragging}
        onDrop={() => {
          onDrop;
        }}
        onDragEnter={() => {
          onDragEnter;
        }}
        onDragLeave={() => {
          setIsDragging(false);
          onDragLeave;
        }}
        onDragOver={() => {
          setIsDragging(true);
          onDragOver;
        }}
        onClick={() => document.getElementById(id || '')?.click()}
        onChange={onChange}
      >
        <Input id={id} type="file" accept={accept} onChange={onChange} />

        <IconContainer>
          <UploadIcon isDragging={isDragging}>
            <IoCloudUploadOutline size={32} />
          </UploadIcon>
        </IconContainer>
        <Message isDragging={isDragging}>{message}</Message>
      </DropZone>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </CardContainer>
  );
};

export default DropFileCard;
