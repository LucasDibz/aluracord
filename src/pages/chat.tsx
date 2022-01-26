import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from '../../config.json';

import styles from '../styles/Chat.module.scss';

type Message = {
  id: number;
  text: string;
  author: string;
};

export default function ChatPage() {
  const router = useRouter();
  const { username } = router.query;

  const [message, setMessage] = React.useState('');
  const [messageList, setMessageList] = React.useState<Message[]>([
    {
      id: -1,
      author: 'lucasdibz',
      text: '🦀',
    },
    {
      id: 0,
      author: 'omariosouto',
      text: 'Ôooooolá Pessoas!',
    },
  ]);

  function handleNewMessage(newMessage: string) {
    const message = {
      id: messageList.length + 1,
      text: newMessage,
      author: username as string,
    };

    setMessageList([message, ...messageList]);
    setMessage('');
  }

  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        // @ts-ignore
        backgroundImage: `url(https://i.pinimg.com/originals/a5/5e/84/a55e84a0ba39069a2a00eb6ef06a73db.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000'],
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          padding: '32px',
          // @ts-ignore
          maxHeight: '95vh',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList messages={messageList} />

          <Box
            as='form'
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={message}
              name='message'
              placeholder='Insira sua mensagem aqui...'
              type='textarea'
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && message.trim().length > 0) {
                  e.preventDefault();
                  handleNewMessage(message);
                }
              }}
              // @ts-ignore
              className={styles.hideOverflowScroll}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
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
        <Text variant='heading5'>Chat</Text>
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

function MessageList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Box
      className={styles.hideOverflowScroll}
      tag='ul'
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px',
      }}
    >
      {messages.map((message) => (
        <Text
          key={message.id}
          tag='li'
          styleSheet={{
            borderRadius: '5px',
            padding: '6px',
            marginBottom: '12px',
            hover: {
              backgroundColor: appConfig.theme.colors.neutrals[700],
            },
          }}
        >
          <Box
            styleSheet={{
              marginBottom: '8px',
            }}
          >
            <Image
              styleSheet={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: '8px',
              }}
              src={`https://github.com/${message.author}.png`}
              alt={message.author}
            />
            <Text tag='strong'>{message.author}</Text>

            {/* Author tag */}
            {message.author === username && (
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '3px',
                  color: appConfig.theme.colors.primary['200'],
                  // @ts-ignore
                  fontStyle: 'italic',
                }}
              >
                you
              </Text>
            )}

            <Text
              styleSheet={{
                fontSize: '10px',
                marginLeft: '8px',
                color: appConfig.theme.colors.neutrals[300],
              }}
              tag='span'
            >
              {new Date().toLocaleDateString()}
            </Text>
          </Box>
          {message.text}
        </Text>
      ))}
    </Box>
  );
}
