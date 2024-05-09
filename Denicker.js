const Base64 = Java.type("java.util.Base64");
const JString = Java.type("java.lang.String")

class Denicker{
    
    //////////////////
    // CORE METHODS //
    //////////////////

    static getNickedPlayers(){
        // Currently the skin test is not very reliable and may produce false positives from NPCs/invisible players displayed to the client from the server
        let nickedPlayers = [];
        this.getAllPlayers().forEach(player => {
            if(this.isNicked(player)) nickedPlayers.push(player)
        });
        return nickedPlayers;
    }

    // RunMultipleTests is a boolean that determines whether or not to run both the UUID and skin tests. If false, only the UUID test is run
    static isNicked(player, runMultipleTests = false){
        if(this.hasMalformedUUID(player)) return true;
        else if (!runMultipleTests && Player.getUUID().toString() === player.getUUID().toString() && this.hasWrongSkinUUID(player)) return true; // handle the case where the user themselves is nicked since clientside their UUID will not be spoofed
        else if(runMultipleTests && (this.hasWrongSkinUUID(player))) return true;
        return false;s
    }

    // Multipurpose informmation retrieval method
    static scan(player){
        const skin = this.getSkinProperty(player);

        // Object format
        let result = {
            name: player.getName(),
            UUID: player.getUUID().toString().replaceAll("-", ""),
            UUIDVersion: player.getUUID().version(),
            
            skinName: skin.profileName,
            skinUUID: skin.profileId.replaceAll("-", ""),
            skinURL: skin.textures.SKIN.url,
            skinType: (skin.textures.SKIN?.metadata?.model) ? "Slim" : "Wide",
            skinTimestamp: skin.timestamp,
            
            hasMalformedUUID: true,
            hasWrongSkinUUID: true,
            usingNickSkin: true,
            
            nicked: false
        }
        result.hasMalformedUUID = this.hasMalformedUUID(player);
        result.hasWrongSkinUUID = this.hasWrongSkinUUID(player);
        result.usingNickSkin = this.usingNickSkin(player);
        result.nicked = result.hasMalformedUUID || result.hasWrongSkinUUID;
        return result;
    }


    /////////////////////////////
    // NICK DETECTION METHODS //
    ////////////////////////////

    // Because of the way nicked players' UUIDs are randomly generated they have a 98.4% not to match the format of a normal player's UUID
    static hasMalformedUUID(player){
        return player.getUUID().version() == 1;
    }

    // Players' UUIDs and UUIDs attached to their skins should match. If they don't, the player is very likely nicked (may be a few edge cases)
    static hasWrongSkinUUID(player){
        const skin = this.getSkinProperty(player);
        if(player.getUUID().version() == 2) return true; // UUID 2 is NPCs, NPCs aren't nicked players
        return skin.profileId.replaceAll("-", "") != player.getUUID().toString().replaceAll("-", "")
    }

    // compare player's skin texture to a list of all the known nick skins presets
    static usingNickSkin(player){
        const nickSkins = JSON.parse(FileLib.read("AntiNick", "src/skins/nickSkins.json")).nickSkins;
        let skin = this.getSkinProperty(player);
        return (nickSkins.some(tSkin => tSkin.textures.SKIN.url == skin.textures.SKIN.url));
    }

    ////////////////////
    // SKIN DENICKING //
    ////////////////////

    static skinDenick(player){
        const skin = this.getSkinProperty(player);
        return(skin.profileName);
    }

    ////////////////////
    // HELPER METHODS //
    ////////////////////

    // Get skin properties of player; information such as UUIDs, usernames, and texture URLs are attached to this property which is used to denick players
    static getSkinProperty(player){
        player = player.getPlayer()
        let playerInfo = Client.getMinecraft().func_147114_u().func_175102_a(player.func_146103_bH().id)
        let textures = playerInfo.func_178845_a().getProperties().get("textures")
        let texturesObj = JSON.parse( new JString(Base64.getDecoder().decode(textures[0].getValue())) )
        return texturesObj;
    }

    // NOTE: This method is identical to the one in AntiNick.js. All calls to getAllPlayers() should be from the AntiNick class
    static getAllPlayers(includeNPCs = false) {
        const NetHandlerPlayClient = Client.getConnection();
        const scoreboard = World.getWorld().func_96441_U();
        const teams = scoreboard.func_96525_g();
        const players = [];
        teams.forEach(team => {
            const teamMembers = team.func_96670_d();
            teamMembers.forEach(member => {
                const networkPlayerInfo = NetHandlerPlayClient.func_175104_a(member); 
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
}

export default Denicker;