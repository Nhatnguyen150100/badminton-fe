import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { message, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Visibility from '../base/visibility';

interface IProps {
  avatar: string | null;
  file: File | undefined;
  handleUploadFile: (file: File | undefined) => void;
}

const styleImg = {
  border: '2px dashed #d9d9d9',
  borderRadius: '50%',
  padding: '16px',
  height: '180px',
  width: '180px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f8f8',
  color: '#999',
  textAlign: 'center',
  cursor: 'pointer',
  overflow: 'hidden',
};

export default function AvatarUpload({
  avatar,
  file,
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
    if (!(file || avatar)) return <></>;
    return (
      <div
        className="border-dashed border-[2px] border-[#d9d9d9] h-[180px] w-[180px] rounded-[50%] relative"
      >
        <Tooltip title="Xóa ảnh">
          <Button
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
          className="h-full w-full object-cover rounded-[50%]"
          src={file ? URL.createObjectURL(file) : avatar ?? undefined}
          // Revoke data uri after image is loaded
          onLoad={() => {
            file ? URL.revokeObjectURL(URL.createObjectURL(file)) : avatar;
          }}
        />
      </div>
    );
  }, [file, avatar]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <>
      <Visibility visibility={!(file || avatar)} suspenseComponent={thumb}>
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
