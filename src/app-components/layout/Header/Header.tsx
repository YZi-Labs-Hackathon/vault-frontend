import { ConnectButton } from '@/app-contexts/thirdweb';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function Header() {
	return (
		<header>
			<Navbar expand="lg" className="bg-body-tertiary">
				<Container>
					<Navbar.Brand href="/">
						<b>Partnr Vaults</b>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mx-auto">
							<Nav.Link href="/">Explore Vaults</Nav.Link>
							{/* <Nav.Link href="/">My Vault</Nav.Link> */}
						</Nav>
					</Navbar.Collapse>
					<div>
						<ConnectButton />
					</div>
				</Container>
			</Navbar>
		</header>
	);
}
