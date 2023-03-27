import { request, gql } from 'graphql-request'

const createWHQuery = gql`mutation createWebhook($webhook: CreateWebhookInputDto!) {
  createWebhook(webhook: $webhook) {
      ... on Success {
        success
        message
        id
      }
      ... on GraphqlError {
        success
        message
        code
      }
  }
}`

const deleteWHQuery = gql`mutation deleteWebhook($id: String!) {
  deleteWebhook(id: $id) {
      ... on Success {
        success
        message
        id
      }
      ... on GraphqlError {
        success
        message
        code
      }
  }
}`

const getWHQuery = gql`query getWebhook($filters: FilterWebhookInputDto) {
  getWebhook(filters: $filters) {
      count
      webhooks {
          id
          createdAt
          updatedAt
          isActive
          listen
          request {
              id
              createdAt
              updatedAt
              headers
              url
          }
      }
  }
}`


export type CreateWebhookInputDto = {
  request: {
    url: string;
  };
  listen: string[];
  name: string;
}

export type GetWebhookInputDto = {
  // url: string;
  // listen: string[];
  id: string;
}

export const createWebhook = async (webhook: CreateWebhookInputDto, url: string, apiKey: string): Promise<{
  id?: string;
  success: boolean;
  message: string;
}> => (await request(url, createWHQuery, { webhook }, {
  'api-key': apiKey
}))?.createWebhook

export const deleteWebhook = async (id: string, url: string, apiKey: string): Promise<{
  id?: string;
  success: boolean;
  message: string;
}> => (await request(url, deleteWHQuery, { id }, {
  'api-key': apiKey
}))?.deleteWebhook

export const getFirstWebhook = async (query: GetWebhookInputDto, url: string, apiKey: string): Promise<{
  id: string;
}> => {
  const data = await request(url, getWHQuery, {
    filters: { query }
  }, {
    'api-key': apiKey
  })
  return data?.getWebhook?.webhooks?.[0]
}
