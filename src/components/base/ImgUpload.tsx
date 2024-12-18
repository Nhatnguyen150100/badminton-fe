import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { message, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Visibility from './visibility';

interface IProps {
  imgProps: string | null;
  file: File | undefined;
  disabled?: boolean;
  handleUploadFile: (file: File | undefined) => void;
}

const styleImg = {
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

export default function ImgUpload({
  imgProps,
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
    if (!(file || imgProps)) return <></>;
    return (
      <div className="border-dashed border-[2px] border-[#d9d9d9] h-[280px] relative">
        <Tooltip title="Xóa ảnh">
          <Button
            disabled={disabled}
            className="ms-3 absolute right-0"
            variant="solid"
            color="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => {
              handleUploadFile(undefined);
            }}
          />
        </Tooltip>
        <img
          crossOrigin="anonymous"
          className="h-full w-full object-contain rounded"
          src={file ? URL.createObjectURL(file) : imgProps ?? undefined}
          // Revoke data uri after image is loaded
          onLoad={() => {
            file ? URL.revokeObjectURL(URL.createObjectURL(file)) : imgProps;
          }}
        />
      </div>
    );
  }, [file, imgProps]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg'],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <>
      <Visibility visibility={!(file || imgProps)} suspenseComponent={thumb}>
        <div
          {...getRootProps()}
          className="hover:border-slate-700"
          style={styleImg as any}
        >
          <input {...getInputProps()} />
          <p>Tải ảnh</p>
        </div>
      </Visibility>
    </>
  );
}
