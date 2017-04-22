const fs = require('fs');
const Discord = require('discord.js');
const Auth = require("./auth.json");
const bot = new Discord.Client();


/***************************************************
 * Static paths and filenames. Change if necessary *
 ***************************************************/
const imagesFileExtension = 'jpg';
const soundFileExtension = 'opus';
const avatarImageFilePath = './img/tuxedo.jpg';
const roseThrowImageFilePath = './img/rose.jpg';
const roseThrowSoundFilePath = './sound/tuxedoquote_rose.opus';
const quoteSoundsPath = './soundQuote/';
const quoteImagesPath = './imgQuote/';
const miscSoundsPath = './soundMisc/';
const miscImagesPath = './imgMisc/';


/********************************
 * Create arrays with filenames *
 ********************************/
const quoteSounds = fs.readdirSync(quoteSoundsPath);
const quoteImages = fs.readdirSync(quoteImagesPath);
const miscSounds = fs.readdirSync(miscSoundsPath);
const miscImages = fs.readdirSync(miscImagesPath);


/****************************
 * Functions used by events *
 ****************************/

/* Sets the bots avatar (async)*/
function setAvatar()
{
    return new Promise((resolve, reject) =>
    {
        bot.user.setAvatar(avatarImageFilePath)
            .then(user => 
            {
                console.log('Tuxedo: check. Mask: check. Rose: check. Tuxedo Mask is ready to help!');
                resolve(user);
            })
            .catch(err =>
            {
                console.error(err);
                reject(err);
            });
    });
}

/* Joins a voice channel (async)*/
function joinVoiceChannel(voiceChannel)
{
    return new Promise((resolve, reject) =>
    {
        if (typeof voiceChannel === 'object')
        {
            voiceChannel.join()
                .then(connection =>
                {
                    console.log('Tuxedo Mask joins the voice channel and is ready to deliver his speech!');
                    resolve(connection);
                })
                .catch(err => 
                {
                    console.error(err);
                    reject(err);
                });
        }
    });
}

/* Leaves a voice channel (sync)*/
function leaveVoiceChannel(voiceChannel)
{
    return new Promise((resolve, reject) =>
    {
        if (typeof voiceChannel === 'object')
        {
            voiceChannel.leave();
            console.log('After delivering his speech, Tuxedo Mask leaves the voice channel!');
            resolve();
        }
        else
        {
            reject();
        }
    });
}
 
/* Sends the rose throw image to the current text channel (async)*/
function sendRoseThrowImage(textChannel)
{
    return new Promise((resolve, reject) =>
    {
        if (typeof textChannel === 'object')
        {
            if (fs.existsSync(roseThrowImageFilePath))
            {
                textChannel.sendFile(roseThrowImageFilePath)
                    .then(message => 
                    {
                        console.log('Rose sucessfully thrown!');
                        resolve(message);
                    })
                    .catch(err =>
                    {
                        console.error(err);
                        reject(err);
                    });
            }
            else
            {
                console.error(new Error('Rose throw image not found in path: ' + roseThrowImageFilePath));
                reject(new Error('Rose throw image not found in path: ' + roseThrowImageFilePath));
            }
        }
    });
}

/* Plays the rose throw soundfile in the current voice channel (async)*/
function playRoseThrowSoundFile(voiceConnection)
{
    return new Promise((resolve, reject) =>
    {
        if (typeof voiceConnection === 'object')
        {
            if (fs.existsSync(roseThrowSoundFilePath))
            {
                const dispatcher = voiceConnection.playFile(roseThrowSoundFilePath);
                console.log('Music starts playing after rose was thrown!');
                dispatcher.once('end', () =>
                {
                    resolve(dispatcher);
                });
            }
            else
            {
                console.error(new Error('Rose throw sound file not found in path: ' + roseThrowSoundFilePath));
                reject(new Error('Rose throw sound file not found in path: ' + roseThrowSoundFilePath));
            }
        }
    });
}

/* Sends a tuxedo quote image to the current text channel (async)*/
function sendTuxedoQuoteImage(textChannel, imageFilePath)
{
    return new Promise((resolve, reject) =>
    {
        if (typeof textChannel === 'object')
        {
            if (fs.existsSync(imageFilePath))
            {
                textChannel.sendFile(imageFilePath)
                    .then(message => 
                    {
                        console.log('Tuxedo quote sucessfully delivered in image form!');
                        resolve(message);
                    })
                    .catch(err =>
                    {
                        console.error(err);
                        reject(err);
                    });
            }
            else
            {
                console.error(new Error('Tuxedo quote image not found in path: ' + imageFilePath));
                reject(new Error('Tuxedo quote image not found in path: ' + imageFilePath));
            }
        }
    });
}

/* Plays a tuxedo quote soundfile in the current voice channel (async)*/
function playTuxedoQuoteSoundfile(voiceConnection, soundFilePath)
{
    return new Promise((resolve, reject) =>
    {
        if (typeof voiceConnection === 'object')
        {
            if (fs.existsSync(soundFilePath))
            {
                const dispatcher = voiceConnection.playFile(soundFilePath);
                console.log('Tuxedo quote sucessfully delivered in speech form!');
                dispatcher.once('end', () =>
                {
                    resolve(dispatcher);
                });
            }
            else
            {
                console.error(new Error('Tuxedo quote sound file not found in path: ' + soundFilePath));
                reject(new Error('Tuxedo quote sound file not found in path: ' + soundFilePath));
            }
        }
    });
}

/* Wait for a specified amount of time (async) */
function sleep(time)
{
    return new Promise((resolve, reject) =>
    {
        setTimeout(resolve, time);
    });
}

/* Sends a random Tuxedo Mask quote via text and voice channel (if available) */
function sendRandomTuxedoQuote(textChannel, voiceChannel, messageText)
{
    /* Select a random quote image and sound */
    const randomIndexNo = Math.floor(Math.random() * ((quoteImages.length - 1) - 0 + 1)) + 0;
    const fileName = quoteImages[randomIndexNo];
    const fileNameLastDotIndex = fileName.lastIndexOf('.');
    const fileNameWithoutExtension = fileNameLastDotIndex > -1 ? fileName.substr(0, fileNameLastDotIndex) : fileName;
    
    if (typeof voiceChannel != 'undefined')
    {    
        console.log('Sending text and voice channel quote');
        joinVoiceChannel(voiceChannel)
            .then(voiceConnection =>
            {
                sendRoseThrowImage(textChannel);
                playRoseThrowSoundFile(voiceConnection)
                    .then(() =>
                    {
                        sleep(1)
                            .then(() =>
                            {
                                sendTuxedoQuoteImage(textChannel, quoteImagesPath + fileName)
                                    .then(() =>
                                    {
                                        playTuxedoQuoteSoundfile(voiceConnection, quoteSoundsPath + fileNameWithoutExtension + '.' + soundFileExtension)
                                            .then(() =>
                                            {
                                                leaveVoiceChannel(voiceChannel);
                                            })
                                    })
                            })
                    })
            });
 
    }
    else
    {
        console.log('Sending text channel only quote');
        sendRoseThrowImage(textChannel)
            .then(() =>
            {
                sleep(1000)
                    .then(() =>
                    {
                        sendTuxedoQuoteImage(textChannel, quoteImagesPath + fileName);
                    })
            });
    }
}

/* Sends a random other Tuxedo Mask quote via text and voice channel (if available) */
function sendRandomTuxedoQuoteOther(textChannel, voiceChannel, messageText)
{
    /* Select a random quote image and sound */
    const randomIndexNo = Math.floor(Math.random() * ((miscImages.length - 1) - 0 + 1)) + 0;
    const fileName = miscImages[randomIndexNo];
    const fileNameLastDotIndex = fileName.lastIndexOf('.');
    const fileNameWithoutExtension = fileNameLastDotIndex > -1 ? fileName.substr(0, fileNameLastDotIndex) : fileName;
    
    if (typeof voiceChannel != 'undefined')
    {    
        console.log('Sending other text and voice channel quote');
        joinVoiceChannel(voiceChannel)
            .then(voiceConnection =>
            {
                sendRoseThrowImage(textChannel);
                playRoseThrowSoundFile(voiceConnection)
                    .then(() =>
                    {
                        sleep(1)
                            .then(() =>
                            {
                                sendTuxedoQuoteImage(textChannel, miscImagesPath + fileName)
                                    .then(() =>
                                    {
                                        playTuxedoQuoteSoundfile(voiceConnection, miscSoundsPath + fileNameWithoutExtension + '.' + soundFileExtension)
                                            .then(() =>
                                            {
                                                leaveVoiceChannel(voiceChannel);
                                            })
                                    })
                            })
                    })
            });
 
    }
    else
    {
        console.log('Sending other text channel only quote');
        sendRoseThrowImage(textChannel)
            .then(() =>
            {
                sleep(1000)
                    .then(() =>
                    {
                        sendTuxedoQuoteImage(textChannel, miscImagesPath + fileName);
                    })
            });
    }
}


/**********
 * Events *
 **********/

/* Change into tuxedo mask */
bot.on('ready', () => 
{
    setAvatar()
        .catch(err =>
        {
            console.error(err);
        });
});

/* Check if sailor moon needs any help */
bot.on('message', message =>
{
    const textChannel = message.channel;
    const voiceChannel = message.member.voiceChannel;
    const messageText = message.content;

    switch (messageText)
    {
        case '!tuxedo quote':
            console.log('Sending tuxedo quote');
            sendRandomTuxedoQuote(textChannel, voiceChannel, messageText);
            break;
            
        case '!tuxedo quote other':
            console.log('Sending other tuxedo quote');
            sendRandomTuxedoQuoteOther(textChannel, voiceChannel, messageText);
            break;
    }
});

/* Wake up and be ready to change into Tuxedo Mask */
bot.login(Auth.botuser_token)
    .catch(err =>
    {
        console.error(err);
    });

