import { Modal } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../lib/store';
import { setModalActive } from '../../lib/reducer/generalSlice';
import { IGeneral } from '../../types/general.types';

interface IProps {
  isOpen?: boolean;
  className?: string;
  nameModal?: IGeneral;
  handleClose?: () => void;
  children: React.ReactNode;
  [x: string]: any;
}

export default function BaseModal({
  nameModal,
  className,
  children,
  handleClose,
  isOpen,
  ...propsAttributes
}: IProps) {
  const modalActive = useSelector(
    (state: IRootState) => state.general.modalActive,
  );
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    if (handleClose) handleClose();
    dispatch(setModalActive(null));
  };

  return (
    <>
      <Modal
        className={className}
        centered
        open={isOpen !== undefined ? isOpen : modalActive === nameModal}
        onCancel={handleCloseModal}
        {...propsAttributes}
      >
        {children}
      </Modal>
    </>
  );
}
