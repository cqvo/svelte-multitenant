import { awsKmsClient } from '$lib/server/utils/key-manager';
import {
	EncryptCommand,
	DecryptCommand,
	type EncryptCommandOutput,
	type KMSClient,
	type DecryptCommandOutput
} from '@aws-sdk/client-kms';
import { pipe, tryCatch } from '$lib/utils/rubico';

// Types
interface EncryptParams {
	plaintext: string;
	keyId: string;
	client?: KMSClient;
}

interface DecryptParams {
	ciphertext: string;
	client?: KMSClient;
}

interface EncryptResult {
	ciphertext: string;
	keyId: string;
	success: true;
}

interface DecryptResult {
	plaintext: string;
	keyId: string;
	success: true;
}

interface KmsError {
	error: string;
	success: false;
}

interface EncryptCommandWithClient {
	command: EncryptCommand;
	client: KMSClient;
}

interface DecryptCommandWithClient {
	command: DecryptCommand;
	client: KMSClient;
}

const textToBuffer = (text: string) => Buffer.from(text, 'utf8');
const base64ToBuffer = (base64: string) => Buffer.from(base64, 'base64');
const bufferToBase64 = (buffer: Uint8Array) => Buffer.from(buffer).toString('base64');
const bufferToText = (buffer: Uint8Array) => Buffer.from(buffer).toString('utf8');

const handleKmsOperationError = (error: Error): KmsError => ({
	error: error.message,
	success: false
});

const buildEncryptCommand = (params: EncryptParams): EncryptCommandWithClient => ({
	command: new EncryptCommand({
		KeyId: params.keyId,
		Plaintext: textToBuffer(params.plaintext),
	}),
	client: params.client ?? awsKmsClient
});

const buildDecryptCommand = (params: DecryptParams): DecryptCommandWithClient => ({
	command: new DecryptCommand({
		CiphertextBlob: base64ToBuffer(params.ciphertext),
	}),
	client: params.client ?? awsKmsClient
});

const processEncryptResponse = (response: EncryptCommandOutput): EncryptResult => {
	if (!response.CiphertextBlob || !response.KeyId) {
		throw new Error('Invalid encryption response from KMS');
	}
	return {
		ciphertext: bufferToBase64(response.CiphertextBlob),
		keyId: response.KeyId,
		success: true
	};
};

const processDecryptResponse = (response: DecryptCommandOutput): DecryptResult => {
	if (!response.Plaintext || !response.KeyId) {
		throw new Error('Invalid decryption response from KMS');
	}
	return {
		plaintext: bufferToText(response.Plaintext),
		keyId: response.KeyId,
		success: true
	};
};

export const encryptWithKms = tryCatch(
	pipe([
		buildEncryptCommand,
		({ command, client }: {command: EncryptCommand, client: KMSClient}) => client.send(command),
		processEncryptResponse
	]),
	handleKmsOperationError
);

export const decryptWithKms = tryCatch(
	pipe([
		buildDecryptCommand,
		({ command, client }: {command: DecryptCommand, client: KMSClient}) => client.send(command),
		processDecryptResponse
	]),
	handleKmsOperationError
);