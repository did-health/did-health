/**
 * Create a FHIR Message Bundle for secure chat between two DIDs
 * @param senderDid Full sender DID (e.g., did:health:11155111:0x123...)
 * @param recipientDid Full recipient DID (e.g., did:health:11155111:doctor-alice)
 * @param messageText Freeform plaintext message content
 * @returns FHIR Bundle resource
 */
export function createFHIRMessageBundle(
  senderDid: string,
  recipientDid: string,
  messageText: string
) {
  return {
    resourceType: 'Bundle',
    type: 'message',
    entry: [
      {
        resource: {
          resourceType: 'MessageHeader',
          eventCoding: {
            system: 'http://hl7.org/fhir/message-events',
            code: 'communication-request',
          },
          source: {
            name: 'DID:Health dApp',
            endpoint: senderDid,
          },
          destination: [
            {
              endpoint: recipientDid,
            },
          ],
          focus: [{ reference: 'Communication/1' }],
        },
      },
      {
        resource: {
          resourceType: 'Communication',
          status: 'completed',
          sender: { reference: `Patient/${senderDid}` },
          recipient: [{ reference: `Practitioner/${recipientDid}` }],
          payload: [{ contentString: messageText }],
        },
      },
    ],
  };
}
