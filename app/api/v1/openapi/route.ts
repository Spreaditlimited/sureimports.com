import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({
    openapi: '3.1.0',
    info: { title: 'Sure Imports Partner Shipping API', version: '1.0.0', description: 'Create affiliate-owned shipping-only requests and read their status.' },
    servers: [{ url: 'https://www.sureimports.com/api/v1', description: 'Production' }],
    security: [{ bearerAuth: [] }],
    paths: {
      '/shipping-plans': { get: { summary: 'List supported shipping plans', parameters: [{ in: 'query', name: 'destinationCountry', schema: { type: 'string' } }], responses: { '200': { description: 'Countries and plans' }, '401': { $ref: '#/components/responses/Unauthorized' } } } },
      '/shipping-requests': { post: { summary: 'Create an affiliate-owned shipping request', parameters: [{ in: 'header', name: 'Idempotency-Key', required: true, schema: { type: 'string', minLength: 8, maxLength: 120 } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateShippingRequest' } } } }, responses: { '201': { description: 'Request accepted and ownership locked', content: { 'application/json': { schema: { $ref: '#/components/schemas/ShippingRequestCreated' } } } }, '400': { $ref: '#/components/responses/InvalidRequest' }, '401': { $ref: '#/components/responses/Unauthorized' }, '409': { description: 'Idempotency or external-reference conflict' }, '429': { description: 'Rate limited' } } } },
      '/shipping-requests/{requestId}': { get: { summary: 'Read an owned shipping request', parameters: [{ in: 'path', name: 'requestId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Shipping request status' }, '401': { $ref: '#/components/responses/Unauthorized' }, '404': { description: 'Request not found or not owned by this affiliate' } } } },
    },
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'Sure Imports API key' } },
      responses: { InvalidRequest: { description: 'Validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }, Unauthorized: { description: 'Key missing, invalid, expired or revoked', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } } },
      schemas: {
        CreateShippingRequest: { type: 'object', additionalProperties: false, required: ['customer', 'shipment', 'externalReference'], properties: {
          customer: { type: 'object', required: ['firstName', 'email', 'phone'], properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, email: { type: 'string', format: 'email' }, phone: { type: 'string' } } },
          shipment: { type: 'object', required: ['shippingName', 'destinationCountry', 'shippingPlanId', 'estimatedQuantity', 'description'], properties: { shippingName: { type: 'string' }, destinationCountry: { type: 'string' }, shippingPlanId: { type: 'string' }, estimatedQuantity: { type: 'number', exclusiveMinimum: 0, description: 'Estimated quantity in the billingUnit returned for the selected shipping plan.' }, estimatedWeightKg: { type: 'number', exclusiveMinimum: 0, deprecated: true, description: 'Backward-compatible KG-only alternative to estimatedQuantity.' }, trackingNumber: { type: 'string' }, description: { type: 'string' }, expectedShipments: { type: 'string' }, wantProductVerification: { type: 'boolean', default: false }, wantConsolidation: { type: 'boolean', default: false }, multipleSuppliers: { type: 'boolean', default: false } } },
          externalReference: { type: 'string', minLength: 3, maxLength: 191 },
        } },
        ShippingRequestCreated: { type: 'object', required: ['requestId', 'externalReference', 'status', 'customerId', 'ownership'], properties: { requestId: { type: 'string' }, externalReference: { type: 'string' }, status: { type: 'string' }, customerId: { type: 'string' }, ownership: { type: 'object', properties: { attributionId: { type: 'string' }, lockedAt: { type: 'string', format: 'date-time' }, source: { const: 'PARTNER_API' } } } } },
        Error: { type: 'object', required: ['code', 'message'], properties: { code: { type: 'string' }, message: { type: 'string' }, errors: { type: 'object' } } },
      },
    },
  });
}
