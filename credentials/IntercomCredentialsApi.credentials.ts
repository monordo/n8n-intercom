import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class IntercomCredentialsApi implements ICredentialType {
  name = 'intercomCredentialsApi';
  displayName = 'Intercom External API';
  properties: INodeProperties[] = [
    // The credentials to get from user and save encrypted.
    // Properties can be defined exactly in the same way
    // as node properties.
    // {
    // 	displayName: 'Url',
    // 	name: 'url',
    // type: 'options',
    // default: 'PROD',
    // required: true,
    // options: [
    // 	{ name: 'DEV', value: 'DEV' },
    // 	{ name: 'PROD', value: 'PROD' },
    // ]
    // },
    {
      displayName: 'Region URL',
      name: 'url',
      required: true,
      type: 'options',
      default: 'EU',
      options: [
        { name: 'EU', value: 'https://api.eu.intercom.io' },
        { name: 'US', value: 'https://api.intercom.io' },
        { name: 'AUSTRALIA', value: 'https://api.au.intercom.io' },
      ]
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      required: true,
      typeOptions: {
        password: true,
      },
      default: '',
    },
  ];
}
