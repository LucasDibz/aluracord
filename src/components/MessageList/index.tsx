import { Box, Text, Image } from '@skynexui/components';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

import appConfig from '../../../config.json';

import styles from './styles.module.scss';

type Message = {
  id: number;
  text: string;
  author: string;
};

interface MessageListProps {
  messages: Message[];
  setMessageList: (messageList: Message[]) => void;
}

export function MessageList({ messages, setMessageList }: MessageListProps) {
  const router = useRouter();
  const { username } = router.query;

  async function deleteMessage(id: number) {
    await supabase.from('messages').delete().match({ id });
    setMessageList(messages.filter((message) => message.id !== id));
  }

  return (
    <Box
      className={styles.hideOverflowScroll}
      tag='ul'
      styleSheet={{
        overflow: 'auto',
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
              display: 'flex',
              alignItems: 'center',
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
            {/* Author tag */}
            {message.author === username && (
              <Text
                onClick={() => deleteMessage(message.id)}
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '5px',
                  color: 'indianred',
                  fontWeight: 'bold',
                  hover: {
                    cursor: 'pointer',
                    // @ts-ignore
                    filter: 'drop-shadow(0 0 0.5rem red)',
                  },
                }}
              >
                X
              </Text>
            )}
          </Box>
          {message?.text.startsWith(':sticker:') ? (
            <Image
              styleSheet={{ maxWidth: '120px' }}
              src={message.text.replace(':sticker:', '')}
              alt='sticker'
            />
          ) : (
            message.text
          )}
        </Text>
      ))}
    </Box>
  );
}
