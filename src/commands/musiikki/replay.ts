import { ApplyOptions } from '@sapphire/decorators'
import { Command, UserError } from '@sapphire/framework'
import { haeJaSoita } from '../../player/soittaminen'

@ApplyOptions<Command.Options>({
  name: 'replay',
  description: 'Mitä? Soitetaan uudelleen äskeinen. Hyvä idea',
  requiredClientPermissions: ['CONNECT', 'VIEW_CHANNEL'],
  preconditions: ['GuildOnly', 'inVoiceChannel']
})
export class ReplayCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      {
        idHints: ['1014567980069290114']
      }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const lastPlayedId: string | null = await this.container.keyv.get(
      `${interaction.guild!.id}:lastPlayed`
    )

    if (!lastPlayedId) {
      throw new UserError({
        message: 'Mitään ei ole soitettu ennen joten huono soittaa äskeisintä uudestaan.',
        identifier: 'JFF',
        context: { ephemeral: true }
      })
    }

    await interaction.deferReply({ ephemeral: true })

    await haeJaSoita(interaction, `https://www.youtube.com/watch?v=${lastPlayedId}`)
  }
}