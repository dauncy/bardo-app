import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

const baseFonts = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
]

const baseUrl = process?.env?.VERCEL_URL ? `https://${process?.env?.VERCEL_URL}` : 'https://bardo-app.vercel.app'

export const ResetEmailTemplate = ({
  email = 'danny.james.wilder@gmail.com',
  passwordResetLink = '',
}: {
  email: string
  passwordResetLink: string
}) => {
  const previewText = 'Follow the instructions to reset your Bardo app password.'

  return (
    <Html>
      <Head>
        <title>{'Reset your Bardo App password'}</title>
        <Font
          fontFamily="normal"
          fallbackFontFamily="Verdana"
          webFont={{
            //https://fonts.gstatic.com/s/?family=Montserrat&family=Outfit:wght@100..900&display=swap
            url: `${baseUrl}/fonts/montserrat/Montserrat-Regular.ttf`,
            format: 'truetype',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="medium"
          fallbackFontFamily="Verdana"
          webFont={{
            //https://fonts.gstatic.com/s/?family=Montserrat&family=Outfit:wght@100..900&display=swap
            url: `${baseUrl}/fonts/montserrat/Montserrat-Medium.ttf`,
            format: 'truetype',
          }}
          fontWeight={500}
          fontStyle="normal"
        />
        <Font
          fontFamily="semibold"
          fallbackFontFamily="Verdana"
          webFont={{
            //https://fonts.gstatic.com/s/?family=Montserrat&family=Outfit:wght@100..900&display=swap
            url: `${baseUrl}/fonts/montserrat/Montserrat-SemiBold.ttf`,
            format: 'truetype',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              fontFamily: {
                normal: ['"normal"', ...baseFonts],
                medium: ['"medium"', ...baseFonts],
                semibold: ['"semibold"', ...baseFonts],
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto">
          <Container className="flex max-w-[480px] flex-1 flex-col px-6 py-14">
            <Section>
              <Row className="flex items-center gap-x-4">
                <Container
                  className="flex size-16 items-center justify-center rounded-full border border-2 border-black bg-yellow-200 p-0"
                  style={{
                    height: '64px',
                    width: '64px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '2px solid #000',
                    padding: 0,
                  }}
                >
                  <Img
                    src={`${baseUrl}/logo.png`}
                    className="m-0 mx-0 my-0 size-10 object-contain object-center p-0"
                    height={40}
                    width={40}
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </Container>
                <Column className="ml-6 gap-y-1 py-0" style={{ marginLeft: '16px' }}>
                  <Text className="m-0 my-0 font-semibold text-3xl leading-none">{'BARDO APP'}</Text>
                  <Text className="my-0 font-light text-base leading-none">{'A community trip journal'}</Text>
                </Column>
              </Row>
            </Section>

            <Section className="mt-8 px-6">
              <Text className="text-base font-normal">
                {'Hi'} <strong className="text-violet-500">{email}</strong>
                {','}
              </Text>

              <Text className="text-base font-normal">
                {
                  'Someone recently requested a password change for your Bardo account. If this was you, you can set a new password here:'
                }
              </Text>
              <Button
                href={passwordResetLink}
                className="mt-5 rounded-md bg-violet-600  px-6 py-3 font-medium text-white"
              >
                <strong>{'Reset Password'}</strong>
              </Button>

              <Text className="mt-8 text-base font-normal">
                {
                  "If you don't want to change your password or didn't request this, just ignore and delete this message."
                }
              </Text>

              <Text className="text-base font-normal">
                {"To keep your account secure, please don't forward this email to anyone."}
              </Text>
            </Section>
            <Section className="px-6">
              <Text className="text-base font-normal">{'Thanks,'}</Text>
              <Text className="-mt-2 text-base font-normal">
                <strong className="text-violet-500">{'Bardo App Team'}</strong>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
