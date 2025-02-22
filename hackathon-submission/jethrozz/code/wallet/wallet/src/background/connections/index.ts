// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createMessage } from '_messages';
import type { SetNetworkPayload } from '_payloads/network';
import type { Permission } from '_payloads/permissions';
import type { WalletStatusChange, WalletStatusChangePayload } from '_payloads/wallet-status-change';
import type { NetworkEnvType } from '_src/shared/api-env';
import { type UIAccessibleEntityType } from '_src/shared/messaging/messages/payloads/MethodPayload';
import { type QredoConnectPayload } from '_src/shared/messaging/messages/payloads/QredoConnect';
import Browser from 'webextension-polyfill';

import type { Connection } from './Connection';
import { ContentScriptConnection } from './ContentScriptConnection';
import { ExternalConnection } from './ExternalConnection';
import { UiConnection } from './UiConnection';

const ALLOWED_EXTENSION_IDS = [
	// 在这里添加允许的扩展ID
	'extension-id-1',
	'agmohnjmhmkeojfkfghfkmdmkienigbn',
	'bljdfjlaobcgbnelmflmmbjbfeahemie',
];

const appOrigin = new URL(Browser.runtime.getURL('')).origin;

export class Connections {
	#connections: Connection[] = [];
	#uiConnection: UiConnection | null = null;
	#externalConnections: Map<string | undefined, ExternalConnection> = new Map();

	constructor() {
		Browser.runtime.onConnect.addListener((port) => {
			try {
				console.log('port create', port);
				let connection: Connection;
				switch (port.name) {
					case ContentScriptConnection.CHANNEL:
						connection = new ContentScriptConnection(port);
						break;
					case UiConnection.CHANNEL:
						if (port.sender?.origin !== appOrigin) {
							throw new Error(
								`[Connections] UI connections are not allowed for origin ${port.sender?.origin}`,
							);
						}
						const uiConnection = new UiConnection(port);
						console.log('uiConnection create', uiConnection);
						this.#uiConnection = uiConnection;
						connection = uiConnection as Connection; // 类型断言
						break;
					default:
						throw new Error(`[Connections] Unknown connection ${port.name}`);
				}
				this.#connections.push(connection);
				connection.onDisconnect.subscribe(() => {
					const connectionIndex = this.#connections.indexOf(connection);
					if (connectionIndex >= 0) {
						this.#connections.splice(connectionIndex, 1);
					}
				});
			} catch (e) {
				port.disconnect();
			}
		});

		// 添加外部消息监听器
		Browser.runtime.onConnectExternal.addListener((port) => {
			console.log('port onConnectExternal create', port);
			if (port.name === ExternalConnection.CHANNEL) {
				let externalConnection = new ExternalConnection(port);
				this.#externalConnections.set(port.sender?.id, externalConnection);
				let connection = externalConnection as Connection;
				this.#connections.push(connection);
				connection.onDisconnect.subscribe(() => {
					const connectionIndex = this.#connections.indexOf(connection);
					if (connectionIndex >= 0) {
						this.#connections.splice(connectionIndex, 1);
					}
				});
			}
		});

		// Browser.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
		// 	try {
		// 		console.log('external listener request');
		// 		// 验证发送者
		// 		if (!sender.id || !ALLOWED_EXTENSION_IDS.includes(sender.id)) {
		// 			throw new Error('未授权的扩展ID');
		// 		}
		// 		console.log('sender:', sender);
		// 		// 获取或创建外部连接
		// 		let externalConnection = this.#externalConnections.get(sender.id);
		// 		if (!externalConnection) {
		// 			//externalConnection = new ExternalConnection(this.#uiConnection!);
		// 			this.#externalConnections.set(sender.id, externalConnection);
		// 		}
		// 		console.log('external connection create ', externalConnection);
		// 		// 处理请求
		// 		//const response = await externalConnection.handleMessage(request);
		// 		return response;
		// 	} catch (error) {
		// 		return {
		// 			success: false,
		// 			error: error instanceof Error ? error.message : '未知错误',
		// 		};
		// 	}
		// 	return true; // 保持消息通道开放以进行异步响应
		// });
	}

	public notifyContentScript(
		notification:
			| { event: 'permissionReply'; permission: Permission }
			| {
					event: 'walletStatusChange';
					change: Omit<WalletStatusChange, 'accounts'>;
			  }
			| {
					event: 'walletStatusChange';
					origin: string;
					change: WalletStatusChange;
			  }
			| {
					event: 'qredoConnectResult';
					origin: string;
					allowed: boolean;
			  },
		messageID?: string,
	) {
		for (const aConnection of this.#connections) {
			if (aConnection instanceof ContentScriptConnection) {
				switch (notification.event) {
					case 'permissionReply':
						aConnection.permissionReply(notification.permission);
						break;
					case 'walletStatusChange':
						if (!('origin' in notification) || aConnection.origin === notification.origin) {
							aConnection.send(
								createMessage<WalletStatusChangePayload>({
									type: 'wallet-status-changed',
									...notification.change,
								}),
							);
						}
						break;
					case 'qredoConnectResult':
						if (notification.origin === aConnection.origin) {
							aConnection.send(
								createMessage<QredoConnectPayload<'connectResponse'>>(
									{
										type: 'qredo-connect',
										method: 'connectResponse',
										args: { allowed: notification.allowed },
									},
									messageID,
								),
							);
						}
						break;
				}
			}
		}
	}

	public notifyUI(
		notification:
			| { event: 'networkChanged'; network: NetworkEnvType }
			| { event: 'storedEntitiesUpdated'; type: UIAccessibleEntityType },
	) {
		for (const aConnection of this.#connections) {
			if (aConnection instanceof UiConnection) {
				switch (notification.event) {
					case 'networkChanged':
						aConnection.send(
							createMessage<SetNetworkPayload>({
								type: 'set-network',
								network: notification.network,
							}),
						);
						break;
					case 'storedEntitiesUpdated':
						aConnection.notifyEntitiesUpdated(notification.type);
						break;
				}
			}
		}
	}
	// 添加用于管理外部连接的方法
	public disconnectExternalConnection(extensionId: string) {
		const connection = this.#externalConnections.get(extensionId);
		if (connection) {
			this.#externalConnections.delete(extensionId);
			// 可以在这里添加清理逻辑
		}
	}
}
