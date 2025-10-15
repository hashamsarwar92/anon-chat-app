import {Html, Head, Font, Preview, Heading, Row, Section, Text, Button} from '@react-email/components';
import { use } from 'react';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({username, otp}: VerificationEmailProps) {
    return (
        <Html lang='en' dir = 'ltr'>
        <Head>
            <title>Verify your email</title>
            <Font
                fontFamily='Roboto'
                fallbackFontFamily='sans-serif'
                fontWeight='400'
                fontStyle='normal'
                webFont={{url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap', format: 'woff'}}
            />
        </Head>
        <Preview> Here is your OTP: {otp}</Preview>
        <Section>
            <Row>
                <Heading as='h1' style={{fontFamily: 'Roboto, sans-serif', fontSize: '24px', fontWeight: '700', color: '#333333', marginBottom: '20px'}}>
                    Hello, {username}
                </Heading>
                <Row>
                    <Text>
                        Thank you for signing up! Please use the following OTP to verify your email address:
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
            </Row>
        </Section>
        </Html>
    )
}
