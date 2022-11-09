import { styled } from '@nextui-org/react';

// IconButton component will be available as part of the core library soon
export const IconButton = styled('button', {
  dflex: 'center',
  // border: '1px solid #7BE3A8',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '1.2rem',
  borderRadius: '100%',
  margin: '0',
  bg: 'transparent',
  color: '#7BE3A8',
  transition: '$default',
  '&:hover': {
    opacity: '1'
  },
  '&:active': {
    opacity: '1'
  }
});