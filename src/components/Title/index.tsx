import { ReactNode } from 'react';

import appConfig from '../../../config.json';

interface TitleProps {
  children: ReactNode;
  tag: keyof JSX.IntrinsicElements;
}

export const Title = (props: TitleProps) => {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals['000']};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};
