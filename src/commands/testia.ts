import { ChatInputCommand, Command } from '@sapphire/framework'
import { isMessageInstance } from '@sapphire/discord.js-utilities'

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options })
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName('ping')
          .setDescription('Ping bot to see if it is alive'),
      {
        idHints: ['1014204242858360982']
      }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const msg = await interaction.reply({
      content: `Ping?`,
      ephemeral: true,
      fetchReply: true
    })

    if (isMessageInstance(msg)) {
      const diff = msg.createdTimestamp - interaction.createdTimestamp
      const ping = Math.round(this.container.client.ws.ping)
      return interaction.editReply(
        `Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`
      )
    }
    return interaction.editReply('Failed to retrieve ping :(')
  }
}
