(function () {

    // Define our function responsible for extending the bot.
    function extend() {
        // If the bot hasn't been loaded properly, try again in 1 second(s).
        if (!window.bot) {
          return setTimeout(extend, 1 * 1000);
        }

        // Precaution to make sure it is assigned properly.
        var bot = window.bot;

        // Load custom settings set below
        bot.retrieveSettings();

        //Extend the bot here, either by calling another function or here directly.

        // You can add more spam words to the bot.
        var spamWords = ['JD', 'zwis'];
        for (var i = 0; i < spamWords.length; i++) {
          window.bot.chatUtilities.spam.push(spamWords[i]);
        }

	 bot.commands._nightmode = {
            command: 'nightmode',
            rank: 'mod',
            type: 'exact',
            functionality: function(chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
                if (!bot.commands.executable(this.rank, chat)) return void(0);
                else {
                    bot.settings.timeGuard = !bot.settings.timeGuard;
                    bot.settings.blacklistEnabled = !bot.settings.blacklistEnabled;
                    bot.settings.historySkip = !bot.settings.historySkip;
                    var tempstr = "TimeGuard ustawiono na: " + bot.settings.timeGuard + ', Blacklist: ' + bot.settings.blacklistEnabled + ', HistorySkip: ' + bot.settings.historySkip + '. Dziękuję, dobranoc.'; //I tak ma zostac bo to kuhwa nightmode. //(albo dzień dobry, mój bóg - Wumekk nie ma czasu żeby zrobić drugą komendę, albo nie jest ona potrzebna).';
                    API.sendChat(tempstr);
                }
            }
        };
        
    
        bot.commands._ban = {
            command: 'permaban',
            rank: 'mod',
            type: 'startsWith',
            functionality: function(chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
                if (!bot.commands.executable(this.rank, chat)) return void(0);
                else {
                    var msg = chat.message;
                    if (msg.length === cmd.length) return API.sendChat(subChat(bot.chat.nouserspecified, {
                        name: chat.un
                    }));
                    var name = msg.substr(cmd.length + 2);
                    var user = bot.userUtilities.lookupUserName(name);
                    if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {
                        name: chat.un
                    }));
                    API.moderateBanUser(user.id, 1, API.BAN.PERMA);
                }
            }
        };
        
         bot.commands.komendadoprobraniarcs = {
            command: 'rcs',
            rank: 'user',
            type: 'exact',
            functionality: function(chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
                if (!bot.commands.executable(this.rank, chat)) return void(0);
                else {
                    API.sendChat("/me Rozszerzenie, które daje Ci możliwość używania emotikon z twitcha i wielu innych serwisów, Autojoin który dołącza za Ciebie do kolejki, Autowoot, specjalny wygląd community i wiele wiele więcej.");
                    API.sendChat("/me  Zainstaluj, a przekonasz się sam: https://rcs.radiant.dj");
                }
            }
        };
        

        bot.commands._cycleCommand = { //pierwsze uruchomienie czasem nie dziala
            command: 'cykl',
            rank: 'mod',
            type: 'exact',
            functionality: function(chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
                if (!bot.commands.executable(this.rank, chat)) return void(0);
                else {
                    if ($(".dj-cycle")[0] === undefined) $("#room-name").click();
                    hnd = $(".dj-cycle")[0].className.toLowerCase();
                    if (hnd === "dj-cycle option") {
                        console.log("[Cycle] Wykryto \"Wl\", proba wylaczenia.");
                        API.moderateDJCycle(false);
                    } else {
                        if (hnd === "dj-cycle option enabled") {
                            console.log("[Cycle] Wykryto \"Wyl\", proba wlaczenia.");
                            API.moderateDJCycle(true);
                        } else API.sendChat("/me Nieznany status cyklu. Może to wystąpić przy pierwszym uruchamianiu komendy. Spróbuj jej użyć jeszcze raz. Jeśli błąd się powtarza, oznacza to, iż nie komenda działa i tak na razie zostanie.")
                    }
                    API.sendChat("/me @Mycka1337 @Mycka1337, pokaż bicka");
                    hnd = [];
                }
            }
        };
        
function spinSlots() {
            var slotArray = [':lemon:',
                ':tangerine:',
                ':strawberry:',
                ':pineapple:',
                ':apple:',
                ':grapes:',
                ':watermelon:',
                ':cherries:',
                ':green_heart:',
                ':bell:',
                ':gem:'];
            var slotValue = [1.5,
            2,
            2.5,
            3,
            3.5,
            4,
            4.5,
            5,
            5.5,
            6,
            6.5];
            var rand = Math.floor(Math.random() * (slotArray.length));
            return [slotArray[rand], slotValue[rand]];
        }

        function spinOutcome(bet, chat) {
            var winnings;
            var outcome1 = spinSlots();
            var outcome2 = spinSlots();
            var outcome3 = spinSlots();

            //Fix bet if blank
            if (bet == null || bet == "" || bet == " " || bet == "!slot" || bet == "!slots") {
                bet = 1;
            }

            //Determine Winnings
            if (outcome1[0] == outcome2[0] && outcome1[0] == outcome3[0]) {
                winnings = Math.round(bet * outcome1[1]);
                setTimeout(function () {
                    API.sendChat("@" + chat.un + " OGM Noob lucker reported... Wygrywasz... Pffff i tak powiecie, że było ustawione :keepo:");
                    API.moderateMoveDJ(chat.uid, 1);
                    setTimeout(function () {
                        API.moderateDeleteChat(chat.cid);
                    }, 7 * 1000, chat.cid);
                    return false;
                }, 2000);
            } else {
                winnings = 0;
            }

            return [outcome1[0], outcome2[0], outcome3[0], winnings];
        }

        //slots
        bot.commands.slotsCommand = {
            command: ['slots', 'slot', 'losuj', 'los'], //The command to be called. With the standard command literal this would be: !slots
            rank: 'user',
            type: 'startsWith',
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void(0);
                if (!bot.commands.executable(this.rank, chat)) return void(0);
                else {
                    this.lastSlots = null;
                    var u = bot.userUtilities.lookupUser(chat.uid);
                    if (u.lastSlots !== null && (Date.now() - u.lastSlots) < 1 * 5 * 60 * 1000) {
                        API.moderateDeleteChat(chat.cid);
                        return void(0);
                    } else {
                        u.lastSlots = Date.now();
                        var msg = chat.message;
                        var space = msg.indexOf(' ');
                        var player = chat.un;
                        var bet = msg.substring(space + 1);
                        bet = Math.round(bet);
                        var updatedTokens;

                        var outcome = spinOutcome(bet, chat);
                        //updatedTokens = slotWinnings(outcome[3], player);

                        //Display Slots
                        if (space === -1 || bet == 1) {
                            //Start Slots

                            setTimeout(function () {
                                API.sendChat("@" + chat.un + " Wylosowano: " + outcome[0] + outcome[1] + outcome[2] + ". Spróbuj ponownie za 5 minut.")
                                setTimeout(function () {
                                    API.moderateDeleteChat(chat.cid);
                                }, 4 * 1000, chat.cid);
                                return false;

                            }, 1000);

                        } else if (bet > 1) {
                            //Start Slots

                            setTimeout(function () {
                                API.sendChat("@" + chat.un + " Wylosowano: " + outcome[0] + outcome[1] + outcome[2] + ". Spróbuj ponownie za 5 minut.")
                                setTimeout(function () {
                                    API.moderateDeleteChat(chat.cid);
                                }, 4 * 1000, chat.cid);
                                return false;
                            }, 1000);

                        } else {
                            return false;
                        }
                    }
                }
            }
        };
  
 
 bot.commands.reloadCommand = [];

        // Load the chat package again to account for any changes
        bot.loadChat();

      }

    //Change the bots default settings and make sure they are loaded on launch

    localStorage.setItem("basicBotsettings", JSON.stringify({
      botName: "Bot",
      language: "Polish",
      chatLink: "https://rawgit.com/WorstUdyrDE/custom/master/lang/pl.json",
      scriptLink: "https://rawgit.com/WorstUdyrDE/source/master/basicBot.js",
      roomLock: false, // Requires an extension to re-load the script
      startupCap: 1, // 1-200
      startupVolume: 0, // 0-100
      startupEmoji: false, // true or false
      autowoot: true,
      autoskip: true,
      smartSkip: false,
      cmdDeletion: true,
      maximumAfk: 120,
      afkRemoval: false,
      maximumDc: 60,
      bouncerPlus: true,
      blacklistEnabled: true,
      lockdownEnabled: false,
      lockGuard: false,
      maximumLocktime: 10,
      cycleGuard: true,
      maximumCycletime: 10,
      voteSkip: false,
      voteSkipLimit: 10,
      historySkip: true,
      timeGuard: true,
      maximumSongLength: 6,
      autodisable: true,
      commandCooldown: 30,
      usercommandsEnabled: true,
      skipPosition: 3,
      skipReasons: [
      ["theme", "This song does not fit the room theme. "],
      ["op", "This song is on the OP list. "],
      ["history", "This song is in the history. "],
      ["mix", "You played a mix, which is against the rules. "],
      ["sound", "The song you played had bad sound quality or no sound. "],
      ["nsfw", "The song you contained was NSFW (image or sound). "],
      ["unavailable", "The song you played was not available for some users. "]
      ],
      afkpositionCheck: 15,
      afkRankCheck: "ambassador",
      motdEnabled: false,
      motdInterval: 5,
      motd: null,
      filterChat: true,
      etaRestriction: true,
      welcome: false,
      bannedLink: "http://worstudyrde.github.io/zbanowane.html",
      rulesLink: "http://worstudyrde.github.io/regulamin.html",
      themeLink: null,
      fbLink: null,
      youtubeLink: null,
      website: null,
      intervalMessages: [],
      messageInterval: 5,
      songstats: false,
      commandLiteral: "!",
      blacklists: {
        BANNED: "https://rawgit.com/WorstUdyrDE/custom/master/blacklists/BANNEDlist.json"
      }
    }));

    // Start the bot and extend it when it has loaded.
    $.getScript("https://rawgit.com/WorstUdyrDE/source/master/basicBot.js", extend);

}).call(this);
