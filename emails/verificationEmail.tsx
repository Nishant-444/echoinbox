import {
	Html,
	Head,
	Preview,
	Heading,
	Row,
	Section,
	Text,
	Button,
} from "react-email";

interface VerificationEmailProps {
	username: string;
	otp: string;
	baseUrl: string;
}

export default function VerificationEmail({
	username,
	otp,
	baseUrl,
}: VerificationEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Head>
				<title>Verification Code</title>
			</Head>
			<Preview>Here's your verification code: {otp}</Preview>
			<Section style={{ fontFamily: "sans-serif" }}>
				<Row>
					<Heading as="h2">Hello {username},</Heading>
				</Row>
				<Row>
					<Text>
						Thank you for registering. Please use the following verification
						code to complete your registration:
					</Text>
				</Row>
				<Row>
					<Text style={{ fontSize: "24px", fontWeight: "bold" }}>{otp}</Text>
				</Row>
				<Row>
					<Text>
						If you did not request this code, please ignore this email.
					</Text>
				</Row>
				<Row>
					<Button
						href={`${baseUrl}/verify/${username}`}
						style={{
							backgroundColor: "#000",
							color: "#fff",
							padding: "12px 20px",
							borderRadius: "5px",
							textDecoration: "none"
						}}
					>
						Verify here
					</Button>
				</Row>
			</Section>
		</Html>
	);
}