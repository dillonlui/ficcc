import { useClient, type FileInputProps } from 'sanity';

type LogoFileValue = {
  asset?: { _ref?: string };
};

type PreviewTone = 'light' | 'dark' | 'splash';

function fileUrl(ref: string, projectId: string, dataset: string) {
  const value = ref.replace(/^file-/, '');
  const lastDash = value.lastIndexOf('-');
  if (lastDash === -1) return null;

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${value.slice(0, lastDash)}.${value.slice(lastDash + 1)}`;
}

function createLogoFileInput(tone: PreviewTone) {
  return function LogoFileInput(props: FileInputProps) {
    const client = useClient({ apiVersion: '2026-03-31' });
    const config = client.config();
    const assetRef = (props.value as LogoFileValue | undefined)?.asset?._ref;
    const previewUrl = assetRef && config.projectId && config.dataset
      ? fileUrl(assetRef, config.projectId, config.dataset)
      : null;
    const isSplashPreview = tone === 'splash';

    return (
      <>
        {props.renderDefault(props)}
        {previewUrl && (
          <div
            style={{
              background: tone === 'dark' ? '#1A3A2C' : '#F5F2EC',
              backgroundImage: isSplashPreview
                ? "linear-gradient(to bottom, rgba(33, 30, 26, 0.65) 0%, rgba(33, 30, 26, 0.4) 45%, rgba(33, 30, 26, 0.72) 100%), url('/images/hero/waterfall-landing-1600.jpg')"
                : undefined,
              backgroundPosition: isSplashPreview ? 'center' : undefined,
              backgroundSize: isSplashPreview ? 'cover' : undefined,
              border: '1px solid rgba(33, 30, 26, 0.16)',
              borderRadius: '4px',
              marginTop: '12px',
              padding: '20px',
            }}
          >
            <img
              src={previewUrl}
              alt={`${props.schemaType.title || 'Logo'} preview`}
              style={{ display: 'block', height: 'auto', margin: '0 auto', maxHeight: '96px', maxWidth: '100%' }}
            />
          </div>
        )}
      </>
    );
  };
}

export const darkLogoFileInput = createLogoFileInput('dark');
export const lightLogoFileInput = createLogoFileInput('light');
export const splashLogoFileInput = createLogoFileInput('splash');
