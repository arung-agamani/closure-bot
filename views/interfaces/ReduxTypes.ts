export interface IDiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

export type ReduxDiscordState = {
  user: IDiscordUser | null;
};

export type ReduxDiscordAction = {
  type: string;
  payload: IDiscordUser;
};

export type ReduxDiscordDispatch = (
  args: ReduxDiscordAction
) => ReduxDiscordAction;
