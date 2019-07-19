import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm'
import { Snowflake } from 'discord.js'

@Entity()
export class ServerConfig {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    guildId: Snowflake

    @Column()
    language: string = 'US'

    @Column()
    platforms: string[] = [
        'appleMusic', 'spotify', 'youtube',
        'youtubeMusic', 'google', 'pandora', 'deezer',
        'amazonMusic', 'tidal', 'napster', 'yandex',
        'itunes', 'googleStore', 'amazonStore',
    ]

    constructor(id: number, guildId: Snowflake, language: string, platforms: string[]) {
        this.id = id
        this.guildId = guildId
        this.language = language
        this.platforms = platforms
    }
}
