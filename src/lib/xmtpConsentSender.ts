import { Client } from '@xmtp/xmtp-js'

export async function sendConsentRequestMessage(
  xmtpClient: Client,
  recipientAddress: string,
  patientId: string,
  practitionerId: string
) {
  const consentBundle = {
    resourceType: 'Bundle',
    type: 'message',
    entry: [
      {
        resource: {
          resourceType: 'MessageHeader',
          id: 'msgheader1',
          eventCoding: {
            system: 'http://example.org/fhir/message-events',
            code: 'consent-request',
          },
          destination: [{ endpoint: recipientAddress }],
          source: { endpoint: 'your-app' },
          timestamp: new Date().toISOString(),
        },
      },
      {
        resource: {
          resourceType: 'Consent',
          id: 'consent1',
          status: 'proposed',
          scope: {
            coding: [{ system: 'http://hl7.org/fhir/consentscope', code: 'patient-privacy' }],
          },
          category: [
            {
              coding: [
                { system: 'http://loinc.org', code: '59284-0', display: 'Privacy Consent' },
              ],
            },
          ],
          patient: { reference: patientId },
          provision: {
            type: 'permit',
            actor: [
              {
                role: {
                  coding: [
                    { system: 'http://hl7.org/fhir/consentactorrole', code: 'practitioner' },
                  ],
                },
                reference: { reference: practitionerId },
              },
            ],
            action: [
              {
                coding: [
                  { system: 'http://hl7.org/fhir/consentaction', code: 'read' },
                ],
              },
            ],
          },
        },
      },
    ],
  }

  const conversation = await xmtpClient.conversations.newConversation(recipientAddress)
  await conversation.send(JSON.stringify(consentBundle))
  console.log('✅ Consent request sent over XMTP')
}
