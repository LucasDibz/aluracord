import { Box, Button, Text } from '@skynexui/components';

export function Header({ text }: { text: string }) {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant='heading5'>{text}</Text>
        <Button
          variant='tertiary'
          colorVariant='dark'
          label='Logout'
          href='/'
        />
      </Box>
    </>
  );
}
