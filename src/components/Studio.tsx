import { StudioProvider, StudioLayout } from 'sanity';
import config from '../../sanity.config';

export default function Studio() {
  return (
    <StudioProvider config={config}>
      <StudioLayout />
    </StudioProvider>
  );
}
