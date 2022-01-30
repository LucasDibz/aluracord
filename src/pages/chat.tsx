import { Box, Icon, Text, TextField } from '@skynexui/components';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { ButtonSendSticker } from '../components/ButtonSendSticker';
import { Header } from '../components/Header';
import { MessageList } from '../components/MessageList';

import { supabase } from '../utils/supabaseClient';

import appConfig from '../../config.json';
import styles from '../styles/Chat.module.scss';
import { Loader } from '../components/Loader';

type Message = {
  id: number;
  text: string;
  author: string;
};

function realTimeListener(addMessage: (message: Message) => void) {
  return supabase
    .from('messages')
    .on('INSERT', (answers) => {
      addMessage(answers.new);
    })
    .on('DELETE', (answers) => {
      console.log('DELETE', answers);
    })
    .subscribe();
}

export default function ChatPage() {
  const router = useRouter();
  const { username } = router.query;

  const [message, setMessage] = React.useState('');
  const [messageList, setMessageList] = React.useState<Message[]>([]);

  useEffect(() => {
    supabase
      .from('messages')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMessageList(data);
        }
      });

    const subscription = realTimeListener((newMessage: Message) => {
      setMessageList((currentlyValue) => {
        return [newMessage, ...currentlyValue];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleNewMessage(newMessage: string) {
    const message = {
      text: newMessage,
      author: username as string,
    };

    const { data } = await supabase.from('messages').insert([message]);

    if (data && data.length > 0) {
      setMessageList([data[0], ...messageList]);
      setMessage('');
    }
  }

  // Display a loader while the messages are being fetched
  if (messageList.length === 0) return <Loader />;

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
        <Header text='Chat' />
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
          <MessageList messages={messageList} setMessageList={setMessageList} />

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
            <Icon
              onClick={() => {
                handleNewMessage(message);
              }}
              name='FaArrowCircleRight'
              styleSheet={{
                borderRadius: '50%',
                padding: '0 10px 0 0',
                minWidth: '50px',
                minHeight: '50px',
                fontSize: '20px',
                marginBottom: '8px',
                marginRight: '8px',
                lineHeight: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'brightness(0.5)',
                hover: {
                  // @ts-ignore
                  filter: 'brightness(1)',
                  cursor: 'pointer',
                },
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNewMessage(':sticker: ' + sticker);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
