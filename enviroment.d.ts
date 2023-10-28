declare global {
  namespace NodeJS {
    interface ProcessEnv {
      token: string;
      prefix: string;
      mongoURI: string;
      guildId: string;
      clientId: string;
      environment: "dev" | "prod" | "test";
    }
  }
}
export {};
