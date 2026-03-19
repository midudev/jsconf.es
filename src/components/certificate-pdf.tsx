import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer'
import { join } from 'node:path'

const FONTS_DIR = join(process.cwd(), 'public', 'certificate')
const IMAGES_DIR = join(process.cwd(), 'public', 'certificate')

const FONT_PATHS = {
  instrumentSerifItalic: join(FONTS_DIR, 'instrument-serif-italic.woff'),
  interRegular: join(FONTS_DIR, 'inter-regular.woff'),
  interBold: join(FONTS_DIR, 'inter-bold.woff'),
}

const IMAGES_PATHS = {
  logo: join(IMAGES_DIR, 'logo.png'),
  signature: join(IMAGES_DIR, 'signature.png'),
}

Font.register({
  src: FONT_PATHS.instrumentSerifItalic,
  family: 'Instrument Serif Italic',
})

Font.register({
  family: 'Inter',
  fonts: [
    { src: FONT_PATHS.interRegular },
    { src: FONT_PATHS.interBold, fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 40,
    backgroundColor: '#0d0d0d',
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 'normal',
  },
})

const EVENT_DATE = '14 de marzo de 2026'

const CertificatePage = ({
  qrCode,
  fullname,
  certificateURL,
}: {
  qrCode: string
  fullname: string
  certificateURL: string
}) => (
  <Page size="A4" orientation="landscape" style={styles.page}>
    {/* Logo */}
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: '24px',
      }}
    >
      <Image
        src={IMAGES_PATHS.logo}
        style={{
          width: '80px',
          height: '100px',
        }}
      />
    </View>

    {/* Title */}
    <View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#f7df1e',
          fontWeight: 'bold',
          letterSpacing: 4,
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        Certificado de asistencia
      </Text>

      <Text
        style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#a3a3a3',
        }}
      >
        Este certificado reconoce que
      </Text>

      {/* Attendee name */}
      <Text
        style={{
          fontSize: '44',
          textAlign: 'center',
          marginTop: '8px',
          marginBottom: '8px',
          fontFamily: 'Instrument Serif Italic',
          color: '#ffffff',
        }}
      >
        {fullname}
      </Text>

      <Text
        style={{
          fontSize: '14px',
          textAlign: 'center',
          maxWidth: '520px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '8px',
          color: '#a3a3a3',
          lineHeight: 1.6,
        }}
      >
        Ha asistido a la conferencia de JavaScript más importante de España, celebrada el {EVENT_DATE}{' '}
        en La Nave, Madrid.
      </Text>

      <Text
        style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#f7df1e',
        }}
      >
        JSConf España 2026
      </Text>
    </View>

    {/* Footer: signature + QR */}
    <View
      style={{
        display: 'flex',
        marginTop: 'auto',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Signature */}
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#f7df1e',
            fontSize: '11px',
          }}
        >
          Organizador
        </Text>
        <Text
          style={{
            fontSize: '11px',
            marginTop: '4px',
            color: '#ffffff',
          }}
        >
          Miguel Ángel Durán
        </Text>
        <Image
          src={IMAGES_PATHS.signature}
          style={{
            width: '130px',
            height: '77.86px',
            marginTop: '8px',
          }}
        />
      </View>

      {/* QR + Date */}
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Image
          src={qrCode}
          style={{
            width: '90px',
            height: '90px',
          }}
        />
        <Text
          style={{
            color: '#f7df1e',
            fontSize: '11px',
            marginTop: '6px',
          }}
        >
          {EVENT_DATE}
        </Text>
      </View>
    </View>

    {/* Bottom text */}
    <Text
      style={{
        textAlign: 'center',
        marginTop: '16px',
        fontSize: '9px',
        color: '#525252',
      }}
    >
      Escanea el código QR o visita el{' '}
      <Link
        style={{
          color: '#737300',
          textDecoration: 'none',
        }}
        href={certificateURL}
      >
        enlace incluido
      </Link>{' '}
      para acceder a este certificado oficial bajo nuestro dominio.
    </Text>
    <Text
      style={{
        textAlign: 'center',
        marginTop: '4px',
        fontSize: '9px',
        color: '#525252',
      }}
    >
      Si necesita más detalles o confirmar la autenticidad de este certificado, puede escribirnos a{' '}
      <Link
        style={{
          color: '#737300',
          textDecoration: 'none',
        }}
        href="mailto:hi@midu.dev"
      >
        hi@midu.dev
      </Link>
      .
    </Text>
  </Page>
)

export const CertificatePDF = ({
  qrCode,
  fullname,
  certificateURL,
}: {
  qrCode: string
  fullname: string
  certificateURL: string
}) => (
  <Document
    author="JSConf España"
    keywords="jsconf, españa, certificado, javascript, 2026"
    subject="Certificado de asistencia a JSConf España 2026"
    title="Certificado JSConf España 2026"
  >
    <CertificatePage qrCode={qrCode} fullname={fullname} certificateURL={certificateURL} />
  </Document>
)

export const generatePDFCertificate = async ({
  qrCodeUrl,
  fullname,
  certificateURL,
}: {
  qrCodeUrl: string
  fullname: string
  certificateURL: string
}) => {
  const blob = await pdf(
    <CertificatePDF qrCode={qrCodeUrl} fullname={fullname} certificateURL={certificateURL} />
  ).toBlob()
  const arrayBuffer = await blob.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
