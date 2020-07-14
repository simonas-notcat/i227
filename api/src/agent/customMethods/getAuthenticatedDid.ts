export const getAuthenticatedDid = async (args: any, context: { authenticatedDid?: string}): Promise<string> => {
  if (context.authenticatedDid) {
    return context.authenticatedDid
  } else {
    return ''
  }
}