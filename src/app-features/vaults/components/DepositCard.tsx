import { NumericInput } from '@/app-components/common/NumericInput';
import { DefaultDepositRules } from '@/app-constants/config';
import { getSignerFromAccount } from '@/app-contexts/thirdweb';
import { getErrorMessage } from '@/app-helpers/errors';
import { useMutationVaultDeposit } from '@/app-hooks/vaults';
import { ERC20__factory } from '@/app-typechains';
import { Vault } from '@/app-types/vault';
import { BigNumber, ethers, Signer } from 'ethers';
import { useFormik } from 'formik';
import { isNaN, isNil } from 'lodash';
import { useState } from 'react';
import { Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useActiveAccount } from 'thirdweb/react';
import ModalDepositSuccess from './ModalDepositSuccess';

interface DepositSectionProps {
	vault: Vault;
}

const DepositSection: React.FC<DepositSectionProps> = ({ vault }) => {
	const { mutateAsync: deposit } = useMutationVaultDeposit();
	const account = useActiveAccount();

	const [isShowDepositSuccess, setIsShowDepositSuccess] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const { values, setFieldValue, isSubmitting, handleSubmit, resetForm } = useFormik<{
		amount: string;
	}>({
		initialValues: {
			amount: '',
		},
		onSubmit: async (values) => {
			try {
				if (isProcessing) {
					return;
				}

				if (!account) {
					throw new Error('Please connect your wallet first');
				}

				setIsProcessing(true);
				let { amount } = values;
				amount = amount.trim();

				if (!amount) {
					throw new Error('Please enter amount to deposit');
				}

				if (isNaN(Number(amount)) || Number(amount) <= 0) {
					throw new Error('Please enter a valid amount to deposit');
				}

				const amountBN = ethers.utils.parseUnits(amount, vault.token.decimals);

				const signer = await getSignerFromAccount(account);

				// Approve token for vault contract
				await approveTokenForDeposit(amountBN, signer);

				// Start depositing
				await deposit({
					vaultAddress: vault.contractAddress,
					depositParams: {
						amount: amountBN.toString(),
						vaultId: vault.id,
						receiver: account.address,
					},
				});
				setIsShowDepositSuccess(true);
				resetForm();
			} catch (e) {
				console.error('Deposit error', e);
				toast.error(getErrorMessage(e));
			} finally {
				setIsProcessing(false);
			}
		},
	});

	const uiMinDeposit = !isNil(vault.depositRule?.min)
		? Number(vault.depositRule.min)
		: DefaultDepositRules.UNSET;

	const uiMaxDeposit = !isNil(vault.depositRule?.max)
		? Number(vault.depositRule.max)
		: DefaultDepositRules.UNSET;

	const minimumSatisfied = () => {
		const amount = Number(values.amount ?? '0');
		// 0 means no minimum requirement
		return uiMinDeposit === DefaultDepositRules.UNSET || amount >= uiMinDeposit;
	};

	const maximumSatisfied = () => {
		const amount = Number(values.amount ?? '0');
		// 0 means no maximum requirement
		return uiMaxDeposit === DefaultDepositRules.UNSET || amount <= uiMaxDeposit;
	};

	const approveTokenForDeposit = async (approvalAmount: BigNumber, signer: Signer) => {
		const erc20 = ERC20__factory.connect(vault.token.address, signer);
		const allowance = await erc20.allowance(account!.address, vault.contractAddress);
		if (allowance.gte(approvalAmount)) {
			return;
		}

		const tx = await erc20.approve(vault.contractAddress, approvalAmount);
		await tx.wait();
	};

	const renderDepositRange = () => {
		if (
			uiMinDeposit === DefaultDepositRules.UNSET &&
			uiMaxDeposit === DefaultDepositRules.UNSET
		) {
			return '';
		}

		if (uiMinDeposit === DefaultDepositRules.UNSET) {
			return `(Max: ${uiMaxDeposit})`;
		}

		if (uiMaxDeposit === DefaultDepositRules.UNSET) {
			return `(Min: ${uiMinDeposit})`;
		}

		return `(${uiMinDeposit} - ${uiMaxDeposit})`;
	};

	const isActionEnabled =
		values.amount !== '' &&
		Number(values.amount) !== 0 &&
		!isProcessing &&
		maximumSatisfied() &&
		minimumSatisfied();

	return (
		<>
			<Card>
				<Card.Header>
					<Card.Title>Deposit</Card.Title>
				</Card.Header>
				<Card.Body>
					<Form.Group className="mb-4">
						<Form.Label>Amount {renderDepositRange()}</Form.Label>
						<InputGroup size="lg" className="mb-3">
							<NumericInput
								className="form-control"
								name="amount"
								type="text"
								useDefaultMaxLength={false}
								inputMode="decimal"
								value={values.amount}
								onValueChange={(value) =>
									setFieldValue('amount', value.value ? value.value.toString() : '')
								}
								decimal={Number(vault.token.decimals ?? 0)}
								readOnly={isSubmitting}
							/>
							<InputGroup.Text>{vault.token.symbol}</InputGroup.Text>
						</InputGroup>
					</Form.Group>
					<Button
						disabled={!isActionEnabled}
						className="w-100"
						size="lg"
						onClick={() => handleSubmit()}
					>
						{isProcessing ? (
							<Spinner className="me-2" size="sm" style={{ borderWidth: '2px' }} />
						) : null}
						Deposit
					</Button>
				</Card.Body>
			</Card>
			<ModalDepositSuccess
				show={isShowDepositSuccess}
				onDismiss={() => setIsShowDepositSuccess(false)}
			/>
		</>
	);
};

export default DepositSection;
