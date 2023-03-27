import type { IHookFunctions, IWebhookFunctions } from 'n8n-core';

import type {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import { createWebhook, deleteWebhook, getFirstWebhook } from './workflow.client';

// const GITLAB_EVENTS = [
// 	{
// 		name: 'Comment',
// 		value: 'note',
// 		description:
// 			'Triggered when a new comment is made on commits, merge requests, issues, and code snippets',
// 	},
// 	{
// 		name: 'Confidential Issues',
// 		value: 'confidential_issues',
// 		description: "Triggered on confidential issues' events",
// 	},
// 	{
// 		name: 'Confidential Comments',
// 		value: 'confidential_note',
// 		description: 'Triggered when a confidential comment is made',
// 	},
// 	{
// 		name: 'Deployments',
// 		value: 'deployment',
// 		description: 'Triggered when a deployment starts/succeeds/fails/is cancelled',
// 	},
// 	{
// 		name: 'Issue',
// 		value: 'issues',
// 		description:
// 			'Triggered when a new issue is created or an existing issue was updated/closed/reopened',
// 	},
// 	{
// 		name: 'Job',
// 		value: 'job',
// 		description: 'Triggered on status change of a job',
// 	},
// 	{
// 		name: 'Merge Request',
// 		value: 'merge_requests',
// 		description:
// 			'Triggered when a new merge request is created, an existing merge request was updated/merged/closed or a commit is added in the source branch',
// 	},
// 	{
// 		name: 'Pipeline',
// 		value: 'pipeline',
// 		description: 'Triggered on status change of Pipeline',
// 	},
// 	{
// 		name: 'Push',
// 		value: 'push',
// 		description: 'Triggered when you push to the repository except when pushing tags',
// 	},
// 	{
// 		name: 'Release',
// 		value: 'releases',
// 		description: 'Release events are triggered when a release is created or updated',
// 	},
// 	{
// 		name: 'Tag',
// 		value: 'tag_push',
// 		description: 'Triggered when you create (or delete) tags to the repository',
// 	},
// 	{
// 		name: 'Wiki Page',
// 		value: 'wiki_page',
// 		description: 'Triggered when a wiki page is created, updated or deleted',
// 	},
// ];

export class MonOrdoTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MonOrdo Trigger',
		name: 'monOrdoTrigger',
		icon: 'file:icon.svg',
		group: ['trigger', 'MonOrdo'],
		version: 1,
		// subtitle:
		// 'MonOrdo backend trigger node. This node will listen to events from the MonOrdo backend and will trigger the workflow when the event occurs.',
		description: 'Starts the workflow when MonOrdo events occur',
		defaults: {
			name: 'MonOrdo Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'monOrdoCredentialsApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events Type',
				name: 'listen',
				type: 'multiOptions',
				default: [],
				options: [
					{
						name: 'account.created',
						value: 'CREATED_ACCOUNT',
						default: true,
					},
					{
						name: 'account.deleted',
						value: 'DELETED_ACCOUNT',
					},
					{
						name: 'account.updated',
						value: 'UPDATED_ACCOUNT',
					},
					{
						name: 'collect.cancelled',
						value: 'CANCELLED_COLLECT',
					},
					{
						name: 'collect.confirmed',
						value: 'CONFIRMED_COLLECT',
					},
					{
						name: 'collect.created',
						value: 'CREATED_COLLECT',
					},
					{
						name: 'collect.deleted',
						value: 'DELETED_COLLECT',
					},
					{
						name: 'collect.rebuilt',
						value: 'REBUILT_COLLECT',
					},
					{
						name: 'collect.synchronized',
						value: 'SYNCHRONIZED_COLLECT',
					},
					{
						name: 'collect.updated',
						value: 'UPDATED_COLLECT',
					},
					{
						name: 'mutuel.created',
						value: 'CREATED_MUTUEL',
					},
					{
						name: 'mutuel.deleted',
						value: 'DELETED_MUTUEL',
					},
					{
						name: 'mutuel.updated',
						value: 'UPDATED_MUTUEL',
					},
					{
						name: 'order.created',
						value: 'CREATED_ORDER',
					},
					{
						name: 'order.deleted',
						value: 'DELETED_ORDER',
					},
					{
						name: 'order.updated',
						value: 'UPDATED_ORDER',
					},
					{
						name: 'parcel.cancelled',
						value: 'CANCELLED_PARCEL',
					},
					{
						name: 'parcel.created',
						value: 'CREATED_PARCEL',
					},
					{
						name: 'parcel.deleted',
						value: 'DELETED_PARCEL',
					},
					{
						name: 'parcel.updated',
						value: 'UPDATED_PARCEL',
					},
					{
						name: 'parceld.with_auto_collect',
						value: 'CREATED_WITH_AUTO_COLLECT_PARCEL',
					},
					{
						name: 'prescription.created',
						value: 'CREATED_PRESCRIPTION',
					},
					{
						name: 'prescription.deleted',
						value: 'DELETED_PRESCRIPTION',
					},
					{
						name: 'prescription.updated',
						value: 'UPDATED_PRESCRIPTION',
					},
					{
						name: 'profile.created',
						value: 'CREATED_PROFILE',
					},
					{
						name: 'profile.deleted',
						value: 'DELETED_PROFILE',
					},
					{
						name: 'profile.updated',
						value: 'UPDATED_PROFILE',
					},
					{
						name: 'vital.created',
						value: 'CREATED_VITALE',
					},
					{
						name: 'vital.deleted',
						value: 'DELETED_VITALE',
					},
					{
						name: 'vital.updated',
						value: 'UPDATED_VITALE',
					},
				],
				required: true,
				placeholder: 'account.created ...',
				description: 'Events type to listen to',
			},
		],
	};

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const creds = await this.getCredentials('monOrdoCredentialsApi');
				console.debug('checkExists', webhookData, creds);

				if (!webhookData.webhookId) {
					// No webhook id is set so no webhook can exist
					return false;
				}

				// Webhook got created before so check if it still exists

				try {
					const wh = await getFirstWebhook(
						{ id: webhookData.webhookId as string },
						creds.url.toString(),
						creds.apiKey as string,
					);
					if (!wh) {
						delete webhookData.webhookId;
						delete webhookData.webhookEvents;
						return false;
					}
				} catch (error) {
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
					// Some error occured
					throw error;
				}

				// If it did not error then the webhook exists
				return true;
			},
			/**
			 * Gitlab API - Add project hook:
			 * 	https://docs.gitlab.com/ee/api/projects.html#add-project-hook
			 */
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');

				console.debug('create url', webhookUrl);

				const creds = await this.getCredentials('monOrdoCredentialsApi');

				const listen = this.getNodeParameter('listen', []) as string[];

				const body = {
					name: `MonOrdo n8n webhook`,
					listen,
					request: {
						url: webhookUrl as string,
						headers: '{}',
					},
				};

				console.debug('create body', body);
				let responseData;
				try {
					responseData = await createWebhook(body, creds.url.toString(), creds.apiKey as string);
					console.debug('createWebhook', responseData);
				} catch (error) {
					console.debug('ERROR', error);
					throw new NodeApiError(this.getNode(), error);
				}

				if (responseData.id === undefined) {
					// Required data is missing so was not successful
					throw new NodeApiError(this.getNode(), responseData, {
						message: 'MonOrdo webhook creation response did not contain the expected data.',
					});
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData.id as string;
				webhookData.webhookEvents = listen;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const creds = await this.getCredentials('monOrdoCredentialsApi');

				if (webhookData.webhookId !== undefined) {
					try {
						await deleteWebhook(
							webhookData.webhookId as string,
							creds.url.toString(),
							creds.apiKey as string,
						);
					} catch (error) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registred anymore
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
				}

				return true;
			},
		},
	};

	// @ts-ignore (because of request)
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		const returnData: IDataObject[] = [];

		returnData.push(bodyData);

		return {
			workflowData: [this.helpers.returnJsonArray(returnData) as INodeExecutionData[]],
		};
	}
}