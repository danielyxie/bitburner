import React from 'react';

interface IProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export function BypassWrapper(props: IProps): React.ReactElement {
  if (!props.content) return <>{props.children}</>;
  return <>{props.content}</>;
}
