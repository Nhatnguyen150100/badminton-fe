import * as React from 'react';
import { Tag } from 'antd';
import { ILevel } from '../types/badmintonGather.types';
import { DEFINE_GATHER } from '../constants/level-gather';

export function onChooseLevelGather(
  level: ILevel,
): React.ReactNode {
  if (!level) return null;
  let element;
  switch (level) {
    case 'Y':
      element = (
        <Tag color="blue" className='px-3 py-2'>
          <span className='text-base'>{DEFINE_GATHER[level]}</span>
        </Tag>
      );
      break;
    case 'TB_Y':
      element = (
        <Tag color="cyan" className='px-3 py-2'>
          <span className='text-base'>{DEFINE_GATHER[level]}</span>
        </Tag>
      );
      break;
    case 'TB':
      element = (
        <Tag color="green" className='px-3 py-2'>
          <span className='text-base'>{DEFINE_GATHER[level]}</span>
        </Tag>
      );
      break;
    case 'TB_K':
      element = (
        <Tag color="orange" className='px-3 py-2'>
          <span className='text-base'>{DEFINE_GATHER[level]}</span>
        </Tag>
      );
      break;
    case 'K':
      element = (
        <Tag color="red" className='px-3 py-2'>
          <span className='text-base'>{DEFINE_GATHER[level]}</span>
        </Tag>
      );
      break;
    case 'CN':
      element = (
        <Tag color="purple" className='px-3 py-2'>
          <span className='text-base'>{DEFINE_GATHER[level]}</span>
        </Tag>
      );
      break;
    default:
      element = null;
      break;
  }
  return element;
}