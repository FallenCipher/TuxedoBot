# TuxedoBot
A Sailor Moon related Discord bot based on [Discord.js](https://github.com/hydrabolt/discord.js)

# What the TuxedoBot can do
TuxedoBot can currently by used to deliver random quotes of Tuxed Mask, the main hero from the Anime Sailor Moon.
By typing in the quote command, TuxedoBot will throw a rose by sending an image to the current text channel and playing a soundfile in the current voice channel if available.
After a short pause, TuxedoBot will deliver a random quote by sending an image and playing his speech in the current voice channel if available.

# Bot commands
```
!tuxedo quote
```
Will delivery a random quote from the "quote" folders.
This should be used for "motivational" speeches.

```
!tuxedo quote other
```
Will delivery a random quote from the "misc" folders.
This should be used for any other random quote.

# Requirements
TuxedoBot requires:
- [Discord.js](https://github.com/hydrabolt/discord.js)
- [Node.js](https://github.com/nodejs/node)
- [node-opus](https://github.com/Rantanen/node-opus)

You can install this by first installing [Node.js](https://github.com/nodejs/node) with [npm](https://github.com/npm/npm).
Then type in the following command:
```
npm install discord.js node-opus --save
```

# Customizing

TuxedoBot uses some static images and soundfiles referenced in the index.js file.
You can customize this by referencing your own images and soundfiles.
Because of copyright reasons, i have not included any binaries (images and soundfiles).

TuxedoBot searches for images and sounds in the "quote" and "misc" folders.
You can put your own images and soundfiles in these folders.
Currently TuxedoBot expects to find .jpg and .opus files. You can change this in the index.js file.

You must use the same name for each image/sound quote pair, so that TuxedoBot can play the appropriate soundfile for each quote.
Example:

```
tuxedoquote_1.jpg
tuxedoquote_1.opus
```
