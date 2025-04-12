import { Button, Modal } from 'react-bootstrap';

interface ModalDepositSuccessProps {
	show?: boolean;
	onDismiss?: () => void;
}

const ModalDepositSuccess: React.FC<ModalDepositSuccessProps> = ({ show, onDismiss }) => {
	return (
		<Modal show={show} onHide={onDismiss} centered>
			<Modal.Header closeButton className="border-0 pb-0" />
			<Modal.Body className="text-center">
				<div className="display-3">✔</div>
				<h4>Deposit successful</h4>
				<p className="mb-4">
					Please wait a few minutes for the funds to appear in the vault.
				</p>
				<div className="mb-3">
					<Button variant="outline-primary" className="px-5" onClick={onDismiss}>
						Got it!
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default ModalDepositSuccess;
