import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  Message,
  PermissionResolvable,
} from "discord.js";
import { ExtendedClient } from "../structures/client";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  args: CommandInteractionOptionResolver;
  interaction?: CommandInteraction;
  message?: Message;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  uerPermissions?: PermissionResolvable[];
  run: RunFunction;
} & ChatInputApplicationCommandData;
