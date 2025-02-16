import { Transaction } from '@mysten/sui/transactions';
import { OwnedObjectRef } from '@mysten/sui/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { suiClient } from '@/contracts';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

type Env = 'testnet' | 'mainnet' | string;
    
async function buildAndPublishPackage(env: Env = 'testnet',basepath: string = './') {
    console.log('Building package...');

    if(!process.env.KEY) {
        throw new Error('KEY is not set');
    }

    const keypair = Ed25519Keypair.fromSecretKey(process.env.KEY!);

    try {
        // Execute the command and capture output
        execSync(`${process.env.CLI_PATH!} client envs`, {
            encoding: 'utf-8',
            stdio: 'inherit'
        });
        const output = execSync(
            `${process.env.CLI_PATH!} move build --dump-bytecode-as-base64 --path ${process.env.PACKAGE_PATH!}`,
            { encoding: 'utf-8' }
        );
        // Parse the JSON output
        // Attempt to parse output, but handle empty or invalid JSON
        const { modules = [], dependencies = [] } = output ? JSON.parse(output) : {};

        // Log the build output for debugging
        console.log('Build output:', output);

        console.log('Publishing...');

        const tx = new Transaction();
        const [upgradeCap] = tx.publish({ modules, dependencies });
        tx.transferObjects([upgradeCap], keypair.getPublicKey().toSuiAddress());

        const result = await suiClient.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
            options: {
                showEffects: true,
            },
            requestType: 'WaitForLocalExecution',
        });

        await suiClient.waitForTransaction({ digest: result.digest });

        console.log('Result: ', JSON.stringify(result, null, 2));

        if (result.effects?.status?.status !== 'success') {
            console.log('\n\nPublishing failed');
            return;
        }

        const createdObjectIds = result.effects.created!.map(
            (item: OwnedObjectRef) => item.reference.objectId
        );

        const createdObjects = await suiClient.multiGetObjects({
            ids: createdObjectIds,
            options: { showContent: true, showType: true, showOwner: true },
        });

        console.log(createdObjects);
        const objects = createdObjects.reduce<Record<string, string>>((acc, item) => {
            if (!item.data) return acc;

            if (item.data.type === 'package') {
                acc.package = item.data.objectId;
            } else if (item.data.type && !item.data.type.startsWith('0x2::')) {
                // Convert type like "profile::State" to "profileState"
                const typeName = item.data.type.slice(68) // Remove package prefix
                    .toLowerCase() // Convert to lowercase
                    .replace(/::/g, ' ') // Replace :: with space temporarily
                    .split(' ') // Split into words
                    .map((word, index) => 
                        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(''); // Join words back together
                acc[typeName] = item.data.objectId;
            }
            return acc;
        }, {});

        const fileContent = `
        import { BaseContract } from "./contracts_base";\n
        export const ${env}: BaseContract = {${Object.keys(objects).map(key => `${key}: "${objects[key]}",`).join('\n  ')}};
        `;
        const baseContent = `export interface BaseContract {
            ${Object.keys(objects)
              .map(key => `${key}: string;`)
              .join('\n  ')}
          }`;
        fs.writeFileSync(`${basepath}/contracts_${env}.ts`, fileContent);
        fs.writeFileSync(`${basepath}/contracts_base.ts`, baseContent);

    } catch (error) {
        console.error('Error:', error);
    }
}

const args = process.argv.slice(2);
const env = args[0] || 'testnet';
const basepath = args[1] || './';
buildAndPublishPackage(env,basepath);