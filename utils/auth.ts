import * as AuthSession from 'expo-auth-session'

export const googleOAuth = async (startSSOFlow: any) => {
  try {
    // Start the authentication process by calling `startSSOFlow()`
    const { createdSessionId, setActive, signUp } = await startSSOFlow({
      strategy: "oauth_google",
      // Defaults to current path
      redirectUrl: AuthSession.makeRedirectUri(),
    });

    // If sign in was successful, set the active session
    if (createdSessionId) {
      if (setActive) {
        await setActive!({ session: createdSessionId });
      }
    }
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: error?.errors[0].longMessage,
    };
  }
};

export const appleOAuth = async (startSSOFlow: any) => {
  try {
    // Start the authentication process using Clerk's startSSOFlow with the "oauth_apple" strategy
    const { createdSessionId, setActive } = await startSSOFlow({
      strategy: "oauth_apple",
      redirectUrl: AuthSession.makeRedirectUri(),
    });

    // If sign in was successful, set the active session
    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error?.errors?.[0]?.longMessage,
    };
  }
};

