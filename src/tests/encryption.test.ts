import { describe, it, expect } from 'vitest';
import { DecryptCommand, EncryptCommand } from '@aws-sdk/client-kms';
import { awsKmsClient } from '$lib/server/utils/key-manager';
import { env } from '$env/dynamic/private';
import { decryptWithKms, encryptWithKms } from '$lib/server/utils/encryption';

describe('Direct KMS Encryption Integration Tests', () => {

	it('should encrypt and decrypt with direct commands', async () => {
		const plaintext = 'Hello, World!';
		const keyId = env.AWS_KMS_KEY_ID;

		const encryptResponse = await awsKmsClient.send(new EncryptCommand({
			KeyId: keyId,
			Plaintext: Buffer.from(plaintext, 'utf8'),
		}));
		expect(encryptResponse).toBeDefined();
		expect(encryptResponse.CiphertextBlob.length).toBeGreaterThan(0);
		expect(encryptResponse.KeyId).toContain(keyId);

		const decryptResponse = await awsKmsClient.send(new DecryptCommand({
			CiphertextBlob: encryptResponse.CiphertextBlob,
			KeyId: encryptResponse.KeyId
		}));
		const decryptedPlaintext = Buffer.from(decryptResponse.Plaintext).toString('utf8');
		expect(decryptedPlaintext).toEqual(plaintext);
	});

	it('should encrypt and decrypt with function', async () => {
		const encryptResult = await encryptWithKms({ plaintext: 'Hello, World!', keyId: env.AWS_KMS_KEY_ID });
		expect(encryptResult).toBeDefined();
		expect(encryptResult.error).toBeUndefined();
		expect(encryptResult.ciphertext).toBeDefined();
		expect(encryptResult.keyId)

		const decryptResult = await decryptWithKms({ ciphertext: encryptResult.ciphertext });
		expect(decryptResult).toBeDefined();
		expect(decryptResult.plaintext).toEqual('Hello, World!');
	});

});