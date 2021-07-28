/* eslint-disable */
export async function getEmailFromHeader(authHeader?: string | any) {
  /* eslint-enable */
  if (authHeader) {
    const base64Payload = authHeader.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64');
    const token = JSON.parse(payload.toString());
    return token.email;
    // Add post-invocation logic here
  } else {
    return undefined;
  }
}
