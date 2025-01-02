import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { message, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Visibility from './visibility';

interface IProps {
  videoProps: string | null;
  file: File | undefined;
  disabled?: boolean;
  handleUploadFile: (file: File | undefined) => void;
}

const styleVideo = {
  border: '2px dashed #d9d9d9',
  borderRadius: '12px',
  padding: '16px',
  height: '280px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f8f8',
  color: '#999',
  textAlign: 'center',
  cursor: 'pointer',
  overflow: 'hidden',
};

export default function VideoUpload({
  videoProps,
  file,
  disabled,
  handleUploadFile,
}: IProps) {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleUploadFile(file);
      message.success(`Tải lên thành công: ${file.name}`);
    }
  };

  const thumb = useMemo(() => {
    if (!(file || videoProps)) return <></>;
    return (
      <div className="border-dashed border-[2px] border-[#d9d9d9] h-[280px] relative">
        <Tooltip title="Xóa video">
          <Button
            disabled={disabled}
            className="ms-3 absolute right-0 z-10"
            variant="solid"
            color="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.preventDefault();
              handleUploadFile(undefined);
            }}
          />
        </Tooltip>
        {file ? (
          <video
            controls
            className="h-full w-full object-contain rounded"
            src={URL.createObjectURL(file)}
            onLoad={() => {
              URL.revokeObjectURL(URL.createObjectURL(file));
            }}
          />
        ) : (
          videoProps && (
            <video
              controls
              className="h-full w-full object-contain rounded"
              src={videoProps}
            />
          )
        )}
      </div>
    );
  }, [file, videoProps]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'video/ogg': ['.ogv'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <>
      <Visibility visibility={!(file || videoProps)} suspenseComponent={thumb}>
        <div
          {...getRootProps()}
          className="hover:border-slate-700"
          style={styleVideo as any}
        >
          <input {...getInputProps()} />
          <p>Tải video</p>
        </div>
      </Visibility>
    </>
  );
}