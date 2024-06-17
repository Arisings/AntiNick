# AntiNick
Handy utility for detecting and denicking nicked players on the Hypixel Network.

To use this you must have the latest 1.8.9 Forge installed and have the latest ChatTriggers version (2.2.0). ChatTriggers: http://chattriggers.com/

# Overview
Whenever a nicked player joins your server, their presence will be automatically announced. Additionally, if they are using their real Minecraft skin (/nick skin real) they will be automatically denicked. This functionality is currently hard coded and is ran every few ticks and cannot be toggled. However, there are plans to add more configurability options in the future.

_Demonstration of AntiNick alerts when joining a world full of nicked players_

<img width="458" alt="Screenshot 2024-05-08 at 9 37 44 PM" src="https://github.com/Arisings/AntiNick/assets/96034376/2fb8c8cf-8c82-4304-9561-7441c21eba11">

## Commands
`/nicklist` -- Display a list of all the nicked players in your lobby.
![Screenshot_2024-02-10_at_12 01 54_AM](https://github.com/Arisings/AntiNick/assets/96034376/67c57d02-e603-47f9-8ef2-3729c5de41fe)
`/scan <player>` -- Get an integrity analysis of a player to see how whether or not they fail nick detection tests.
`/getskininfo <player>` -- Copies the NBT data of a player's skin to your clipboard.

## Coming soon??
- Automatic detection to see if a nick is automatically generated or manually picked (i.e. by a YouTuber or Staff member)
- More configurability (Config GUI)
- Denick caching
- Support for 1.20 ChatTriggers
- Fabric mod support?

# ⚠️ DISCLAIMER ⚠️
This module was made purely for educational purposes and possibly violates [Hypixel's Terms of Service](https://hypixel.net/rules). While the module should be impossible to detect serverside, I am not responsible for how you use it or if you get banned for using it. Use it at your own risk.
