'use client';

import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export const ArrowButton = ({
  direction,
  ...rest
}: Omit<IconButtonProps, 'colorScheme' | 'aria-label' | 'icon'> & {
  direction: 'left' | 'right';
}) => (
  <Tooltip
    hasArrow
    label={`${direction === 'left' ? 'Previous' : 'Next'} Page`}
    bg="gray.200"
    color="black"
    fontSize="sm"
  >
    <IconButton
      colorScheme="info"
      aria-label={`${direction === 'left' ? 'prev' : 'next'}-page`}
      icon={direction === 'left' ? <HiChevronLeft /> : <HiChevronRight />}
      {...rest}
    />
  </Tooltip>
);
