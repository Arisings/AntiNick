import Denicker from "./Denicker";

const prefix = "&8[&aAntiNick&8]";

class AntiNick{
    /**
     * Retrieves all players currently in the game, including those outside of the player's primary render distance. This works using teams, meaning it may not function properly on all servers.
     * @param {boolean} includeNPCs - Whether to include non-player characters (NPCs) in the result.
     * @returns {Array<PlayerMP>} - An array of PlayerMP objects representing the players.
     */
    static getAllPlayers(includeNPCs = false) {
        const NetHandlerPlayClient = Client.getConnection();
        const scoreboard = World.getWorld()?.func_96441_U();
        if(!scoreboard) return []; // Handle World not being loaded
        const teams = scoreboard.func_96525_g();
        const players = [];
        teams.forEach(team => {
            const teamMembers = team.func_96670_d();
            teamMembers.forEach(member => {
                const networkPlayerInfo = NetHandlerPlayClient.func_175104_a(member); //
                if (networkPlayerInfo ) {
                    let otherPlayer = new net.minecraft.client.entity.EntityOtherPlayerMP(World.getWorld(), networkPlayerInfo.func_178845_a())
                    let p = new PlayerMP(otherPlayer)
                    if(p.getUUID().version() !== 2 || includeNPCs) {
                        players.push(p)
                    }
                }
            });
        });
        return players;
    };

    /**
     * Retrieves the Denicker class.
     * @returns {Denicker} The Denicker class.
     */
    static getDenicker(){
        return Denicker;
    }
}

export default AntiNick;