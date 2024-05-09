import AntiNick from "./src/AntiNick";

const Denicker = AntiNick.getDenicker();

//////////////////////////////////
// AUTO NICK DETECTION/DENICKER //
//////////////////////////////////

let playerList = AntiNick.getAllPlayers();

register('worldLoad', () => {
    playerList = [];
})

// Planned check intervals coming soon to reduce lag in large lobbies:
    // Every tick if total player count is less than 10
    // Every 2 ticks if total player count is less than 25
    // Every 4 ticks if total player count is less than 50
    // Every 10 ticks if total player count is less than 100
    // Every 20 ticks if total player count is less than 200
register('tick', (partialTick) => {
    if(partialTick % 4 != 0) return
    let newPlayers = AntiNick.getAllPlayers().filter(p => !playerList.some(p2 => p2.getName() === p.getName()));
    newPlayers.forEach(player => {
       if(Denicker.isNicked(player)){
        let results = Denicker.scan(player);
        let msg = new Message();
        msg.addTextComponent(`§8[&2&lAntiNick&8] `);
        if(Player.getUUID().toString() === player.getUUID().toString()){
            msg.addTextComponent(new TextComponent(`§7You are nicked as ${(player.getTeam().getPrefix()) ? player.getTeam().getPrefix() : "§c[NICKED] "}${player.getName()}&7.`).setHoverValue(`&2&lAntiNick Detection\n&7Bad UUID: ${(results.hasMalformedUUID) ? "&a" : "&c"}${results.hasMalformedUUID}\n&7Wrong Skin UUID: ${(results.hasWrongSkinUUID) ? "&a" : "&c"}${results.hasWrongSkinUUID}\n&7Nicked Skin: ${(results.usingNickSkin) ? "&a" : "&c"}${results.usingNickSkin}\n\n&eClick for more info on the player!`).setClick("run_command", `/scan ${player.getName()}`));
        } else {
            msg.addTextComponent(new TextComponent(`§f${(player.getTeam().getPrefix()) ? player.getTeam().getPrefix() : "§c[NICKED] "}${player.getName()} §7is nicked. ${(Denicker.usingNickSkin(player)) ? "" : "&7Their real username is &a" + Denicker.skinDenick(player) + "&7."}`).setHoverValue(`&2&lAntiNick Detection\n&7Bad UUID: ${(results.hasMalformedUUID) ? "&a" : "&c"}${results.hasMalformedUUID}\n&7Wrong Skin UUID: ${(results.hasWrongSkinUUID) ? "&a" : "&c"}${results.hasWrongSkinUUID}\n&7Nicked Skin: ${(results.usingNickSkin) ? "&a" : "&c"}${results.usingNickSkin}\n\n&eClick for more info on the player!`).setClick("run_command", `/scan ${player.getName()}`));
        }
        msg.chat();
       }
    });
    playerList = AntiNick.getAllPlayers();
})

//////////////
// COMMANDS //
//////////////

register('command', (name) => {
    let player = null;
    
    if(!name) {
        let lookingAt = Player.lookingAt();
        if(lookingAt && lookingAt instanceof Entity && lookingAt.getClassName() === "EntityOtherPlayerMP"){
            name = new PlayerMP(lookingAt.getEntity()).getName();
        } else {
            return ChatLib.chat("&cTry looking at a player or otherwise specify a player name!");
        }
    }

    AntiNick.getAllPlayers().forEach(p => {
        if(p.getName().toLowerCase() === name.toLowerCase()){
            player = p;
        }
    });
    
    if(!player) return ChatLib.chat("&cCould not find that player in your world!");
    let results = Denicker.scan(player);

    let scan = new Message();

    scan.addTextComponent("&a&m" + '-'.repeat(ChatLib.getChatWidth()/6.03773584906 + 1))
    scan.addTextComponent(ChatLib.getCenteredText("&2&lAntiNick Player Scan\n"))
    scan.addTextComponent(ChatLib.getCenteredText(`${(player.getTeam().getPrefix()) ? player.getTeam().getPrefix() : ""}${player.getName()}\n\n`))
    scan.addTextComponent("&2General Info\n");
    scan.addTextComponent(`&7Name: &f${results.name}\n`);
    scan.addTextComponent(`&7UUID: &f${results.UUID} (v${(results.UUIDVersion)})\n\n`);
    scan.addTextComponent(new TextComponent("&2Skin Info\n").setHoverValue(`&eClick to view raw skin data!`).setClick("run_command", `/gsi ${player.getName()}`));
    scan.addTextComponent(`&7Username: &f${results.skinName}\n`);
    scan.addTextComponent(`&7UUID: &f${results.skinUUID}\n`);
    scan.addTextComponent(`&7URL: &b${results.skinURL.replaceAll('http://', 'https://')}\n`);
    scan.addTextComponent(`&7Type: &f${results.skinType}\n`);
    let date = new Date(results.skinTimestamp);
    scan.addTextComponent(`&7Timestamp: &f${date.toLocaleString()}\n\n`);
    scan.addTextComponent("&2AntiNick Test Results\n");
    scan.addTextComponent(new TextComponent(`&7Bad UUID:`).setHoverValue(`&eDue to nicked players' UUIDs being randomy generated, they have a 98.4% chance to not be in the correct format as that as an actual player.`)).addTextComponent(` ${(results.hasMalformedUUID) ? "&a" : "&c"}${results.hasMalformedUUID}\n`);
    scan.addTextComponent(new TextComponent(`&7Wrong Skin UUID:`).setHoverValue(`&ePlayers' UUIDs and UUIDs attached to their skins should match. If they don't, the player is very likely nicked (there may be a few edge cases).`)).addTextComponent(` ${(results.hasWrongSkinUUID) ? "&a" : "&c"}${results.hasWrongSkinUUID}\n`);
    scan.addTextComponent(new TextComponent(`&7Nicked Skin:`).setHoverValue(`&eThe player's skin texture is compared to a list of all the known nick skin textures. Nicked players using nick skins cannot be denicked.`)).addTextComponent(` ${(results.usingNickSkin) ? "&a" : "&c"}${results.usingNickSkin}\n`);
    scan.addTextComponent(new TextComponent(`&7Nicked:`).setHoverValue(`&eWhether or not the player is nicked.`)).addTextComponent(` ${(results.nicked) ? "&a" : "&c"}${results.nicked}`);
    scan.addTextComponent("\n\n&a&m" + '-'.repeat(ChatLib.getChatWidth()/6.03773584906 + 1))
    scan.chat();
}).setName('scan')

register('command', () => {
    let nickedPlayers = Denicker.getNickedPlayers();

    let nickedPlayerList = new Message();
    nickedPlayerList.addTextComponent("&a&m" + '-'.repeat(ChatLib.getChatWidth()/6.03773584906 + 1))
    nickedPlayerList.addTextComponent(ChatLib.getCenteredText("&2&lAntiNick Detection\n"))
    nickedPlayerList.addTextComponent(ChatLib.getCenteredText("&6Nicked Players on Your World\n\n"))

    if(nickedPlayers.length > 0){
      nickedPlayers.forEach(player => {
        let results = Denicker.scan(player);
        nickedPlayerList.addTextComponent(`§8➤ `);
        nickedPlayerList.addTextComponent(new TextComponent(`§f${(player.getTeam().getPrefix()) ? player.getTeam().getPrefix() : "§c[NICKED] "}${player.getName()} §e➜ ${(!Denicker.usingNickSkin(player)) ? "§a[DENICKED] " + Denicker.skinDenick(player) : (Player.getUUID().toString() === player.getUUID().toString()) ?  "§a[YOU] " + Player.getName() : "§c[CANNOT DENICK]"}`).setHoverValue(`&2&lAntiNick Detection\n&7Bad UUID: ${(results.hasMalformedUUID) ? "&a" : "&c"}${results.hasMalformedUUID}\n&7Wrong Skin UUID: ${(results.hasWrongSkinUUID) ? "&a" : "&c"}${results.hasWrongSkinUUID}\n&7Nicked Skin: ${(results.usingNickSkin) ? "&a" : "&c"}${results.usingNickSkin}\n\n&eClick for more info on the player!`).setClick("run_command", `/scan ${player.getName()}`));
        nickedPlayerList.addTextComponent("\n");
      });
    } else {
        nickedPlayerList.addTextComponent(ChatLib.getCenteredText(`&cNone found out of ${AntiNick.getAllPlayers().length} player${(AntiNick.getAllPlayers().length === 1) ? "" : "s"} scanned!`));
        nickedPlayerList.addTextComponent("\n");
    }

    nickedPlayerList.addTextComponent("\n&a&m" + '-'.repeat(ChatLib.getChatWidth()/6.03773584906 + 1))
  
    nickedPlayerList.chat();
}).setName("nicklist").setAliases(['nl', 'nickedlist', 'getnickedplayers', 'gnp'])

register('command', (name) => {
    let player = null;

    if(!name) {
        let lookingAt = Player.lookingAt();
        if(lookingAt && lookingAt instanceof Entity && lookingAt.getClassName() === "EntityOtherPlayerMP"){
            name = new PlayerMP(lookingAt.getEntity()).getName();
        } else {
            return ChatLib.chat("&cTry looking at a player or otherwise specify a player name!");
        }
    }

    AntiNick.getAllPlayers().forEach(p => {
        if(p.getName().toLowerCase() === name.toLowerCase()){
            player = p;
        }
    })

    if(!player) return ChatLib.chat("&cCould not find that player in your world!");

    let skin = Denicker.getSkinProperty(player);
    ChatLib.command(`ct copy ${JSON.stringify(skin, null, 2)}`, true);
    ChatLib.chat(new Message(new TextComponent(`&aCopied skin data for ${player.getName()} (${player.getUUID().toString()}) to clipboard!`).setHoverValue(JSON.stringify(skin, null, 2))));
}).setName('getSkinInfo').setAliases(['gsi', 'skin'])
