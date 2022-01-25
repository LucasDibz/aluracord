import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';

import { Title } from '../components/Title';
import { useDebounce } from '../hooks/useDebounce';

import appConfig from '../../config.json';
import styles from '../styles/Home.module.scss';

type GitHubUser = {
  avatar_url: string;
  login: string;
  name: string;
};
const HomePage: NextPage = () => {
  const [user, setUser] = useState<GitHubUser>();
  const [username, setUsername] = useState('');

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  const debouncedUsername: string = useDebounce<string>(username, 1000);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(
        `https://api.github.com/users/${debouncedUsername}`,
      );
      const user = await response.json();
      setUser(user);
    }

    if (debouncedUsername.length <= 2) {
      setUser(undefined);
      return;
    }

    fetchUser();
  }, [debouncedUsername]);

  return (
    <>
      <Box
        className={styles.container}
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%',
            maxWidth: '700px',
            borderRadius: '5px',
            padding: '32px',
            margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            tag='form'
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '100%', sm: '50%' },
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <Title tag='h2'>Boas vindas de volta!</Title>
            <Text
              variant='body3'
              styleSheet={{
                marginBottom: '32px',
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              name='username'
              onChange={handleUsernameChange}
              value={username}
              placeholder='Digite o seu usuário do GitHub'
              fullWidth
              // textFieldColors={{
              //   neutral: {
              //     textColor: appConfig.theme.colors.neutrals[200],
              //     mainColor: appConfig.theme.colors.neutrals[900],
              //     mainColorHighlight: appConfig.theme.colors.primary[500],
              //     backgroundColor: appConfig.theme.colors.neutrals[800],
              //   },
              // }}
            />
            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals['000'],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              flex: 1,
              height: '240px',
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
              }}
              src={`https://github.com/${user?.login ?? 'github'}.png`}
              alt={user?.login ?? 'github'}
            />
            <Text
              variant='body4'
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px',
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
