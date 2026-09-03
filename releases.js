/* ==========================================================================
   Jett2Fly — releases.js
   The single source of truth for music on the site. Every page reads this.

   To add a release, add an object at the top of RELEASES:
     slug            lowercase-with-dashes, must match images/covers/<slug>.jpg
                     and images/thumbs/<slug>.jpg (800px and 240px square JPEGs)
     title, artist, type ("Album" | "EP" | "Mixtape" | "Single"), date (YYYY-MM-DD)
     link            the "all platforms" page
     streamingLinks  optional: spotify / apple / youtube / soundcloud (omit any you lack)
     tracks          array of track names (or "songs": 1 for a single)
   ========================================================================== */
window.RELEASES = [
  {
    "slug": "magnum-opus",
    "title": "Magnum Opus",
    "artist": "SyWavy",
    "type": "Album",
    "date": "2026-05-29",
    "link": "https://sywavy.com/release.html?id=magnum-opus",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/4hAfaZSwoKQpMaJV4LDgR4",
      "apple": "https://music.apple.com/us/album/magnum-opus/6772945346?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/playlist?list=OLAK5uy_k70JNhW_BgIx7tbXN1K1P4AXipevLgT-c"
    },
    "tracks": [
      "Vertex",
      "Rust",
      "To Two B*tches",
      "SZA",
      "Carolina Herrera",
      "Slow? Never",
      "YAMAHA RIDIN'",
      "Shameless Guy",
      "Proceed",
      "Please lmk",
      "Favorite Meme",
      "Gorgeous So Fye",
      "Steer",
      "Tower of Tears",
      "Wavy Deagle",
      "Flame",
      "Put It On! (feat. The Part Time Models)",
      "Awtside"
    ]
  },
  {
    "slug": "flame",
    "title": "Flame",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2025-11-14",
    "link": "https://sywavy.com/release.html?id=flame",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/0WaLfswFe4BSvo4k22B4ai",
      "apple": "https://music.apple.com/us/album/flame-single/1853813425?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://youtu.be/qJxKahnEGDY?si=g5o5KTHsAeIqa5Om"
    },
    "songs": 1
  },
  {
    "slug": "wavy-deagle",
    "title": "Wavy Deagle",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2025-07-25",
    "link": "https://sywavy.com/release.html?id=wavy-deagle",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/3uNqA3foeMEjVJFw5Rw1JI",
      "apple": "https://music.apple.com/us/album/wavy-deagle-single/1827862972?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://youtu.be/PJ7GmOT6p5g?si=xI-twIzznTQ7iSO5"
    },
    "songs": 1
  },
  {
    "slug": "put-it-on",
    "title": "Put It On!",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2025-05-09",
    "link": "https://sywavy.com/release.html?id=put-it-on",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/2XFFQePnEMHqBNgDBCMKxq",
      "apple": "https://music.apple.com/us/album/put-it-on-feat-the-part-time-models-single/1812873731?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://youtu.be/MBIr637uDH8?si=PzzJPMs2uFSBL9Lb"
    },
    "songs": 1
  },
  {
    "slug": "awtside",
    "title": "Awtside",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2025-04-04",
    "link": "https://sywavy.com/release.html?id=awtside",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/14ve923JA9HEX1tl9w8qWf",
      "apple": "https://music.apple.com/us/album/awtside-single/1805478348?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://youtu.be/1HaIyHpOlDI?si=dEKEJLaqUu49BPrN"
    },
    "songs": 1
  },
  {
    "slug": "imma-floridian",
    "title": "Imma Floridian",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2025-02-28",
    "link": "https://sywavy.com/release.html?id=imma-floridian",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/5Rir6SkxpyUWHvdnU89fD8",
      "apple": "https://music.apple.com/us/album/imma-floridian-single/1799066703?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://youtu.be/vq3Tf8Egytk?si=fsdII-CsSJXJVsVW"
    },
    "songs": 1
  },
  {
    "slug": "flight-370",
    "title": "Flight 370",
    "artist": "SyWavy",
    "type": "Album",
    "date": "2024-11-29",
    "link": "https://sywavy.com/release.html?id=flight-370",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/4B3OKpetlnrHKDg6HPNTUU",
      "apple": "https://music.apple.com/us/album/flight-370/1782697824?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=qGbaXxkGRGM&list=OLAK5uy_mERcFQWC0d4XLLWmh_k6GNV_OqZOAx7uE",
      "soundcloud": "https://soundcloud.com/sywavy/sets/flight-370?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    "tracks": [
      "Squish",
      "Botanical Gardens (feat. The Part Time Models)",
      "Tour",
      "Bermuda's Artifact",
      "Clairo",
      "Catch Flights & CRY (feat. The Part Time Models)",
      "Bulky Jewelry",
      "We're Not SAFe",
      "Self Melting Love",
      "Shadows (feat. The Part Time Models)",
      "The Shining",
      "Can't Tell Me What It's Not"
    ]
  },
  {
    "slug": "gentleman-from-da-south",
    "title": "Gentleman From Da South",
    "artist": "SyWavy",
    "type": "EP",
    "date": "2024-06-21",
    "link": "https://sywavy.com/release.html?id=gentleman-from-da-south",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/4CHWxeIgdCqAIQ6Px0Pbn5",
      "apple": "https://music.apple.com/us/album/gentleman-from-da-south-single/1752975738?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=_yAGKWG1V6U&list=OLAK5uy_mQNeMqY-5afL5g8xuzrGCfpJd5ykwDIIs"
    },
    "tracks": [
      "Stadium Music",
      "I have to leave.",
      "Talk, Money, Fashion"
    ]
  },
  {
    "slug": "deep-voice-bastards",
    "title": "Deep Voice Bastards",
    "artist": "SyWavy",
    "type": "Mixtape",
    "date": "2023-12-22",
    "link": "https://sywavy.com/release.html?id=deep-voice-bastards",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/1WK4MQSYhBpgCjTI7LrP20",
      "apple": "https://music.apple.com/us/album/deep-voice-bastards/1722652348?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=ancx1bis_C0&list=OLAK5uy_mplCeMJZhAgAjcJZCQXOq5xMzxgHiAgVI",
      "soundcloud": "https://soundcloud.com/sywavy/sets/deep-voice-bastards?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    "tracks": [
      "Bang Me Up Again",
      "Bruh I'm High asf xD",
      "She's The Wettest",
      "White Girls Call Me Hot",
      "Del Rey",
      "AudioSlave",
      "You Better TELL ME.",
      "This Headache Crazzzy",
      "Intrusive Thoughts (feat. Kuy)",
      "Coaster"
    ]
  },
  {
    "slug": "alchemy",
    "title": "Alchemy",
    "artist": "Kuy",
    "type": "Album",
    "date": "2023-05-26",
    "link": "https://distrokid.com/hyperfollow/kkilla11/alchemy",
    "streamingLinks": {
      "spotify": "https://prf.hn/click/camref:1101ljvYv/pubref:albumuuid%3DA34B3B2A-9DBE-479B-96275D19169A9511/destination:https://open.spotify.com/album/3RujPGugSp1n2MHgzFjqoS",
      "apple": "https://music.apple.com/us/album/alchemy/1686955546?uo=4",
      "youtube": "https://www.youtube.com/watch?v=VJgzUkvSqhk&list=OLAK5uy_l9g3gTBT9WiIoVxBTbBwQdqGU1jM7AuRk"
    },
    "tracks": [
      "Global",
      "NPR",
      "Killing Commentadore",
      "Sir Sinner",
      "Chaos",
      "Serpent",
      "Picture Perfect",
      "Summer Snow",
      "Shells",
      "Ctrl",
      "God's Hands",
      "Fountain of Youth",
      "Silver Surfer"
    ]
  },
  {
    "slug": "wavy-life",
    "title": "Wavy Life",
    "artist": "SyWavy",
    "type": "Album",
    "date": "2023-03-17",
    "link": "https://sywavy.com/release.html?id=wavy-life",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/7ePDLLrFzDw75kn738TLJZ",
      "apple": "https://music.apple.com/us/album/wavy-life/1676929456?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=gZfzifoETpQ&list=OLAK5uy_lluLKP6yU_8X1I6xkZxNfn2OK_qxeR0lU",
      "soundcloud": "https://soundcloud.com/sywavy/sets/wavy-life?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    "tracks": [
      "Whirlpool Window",
      "Triad",
      "71%",
      "Out The Blue",
      "Cruise Jam",
      "Move That Ocean",
      "Aqua Artist",
      "Caution",
      "Telly",
      "3D",
      "Fantasia",
      "Wind Waker"
    ]
  },
  {
    "slug": "the",
    "title": "The",
    "artist": "SyWavy",
    "type": "EP",
    "date": "2022-10-12",
    "link": "https://sywavy.com/release.html?id=the",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/5PMP9IA0iptvkT7WiL5bRC",
      "apple": "https://music.apple.com/us/album/the-single/1649527868?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=l1iCAX1qQbM&list=OLAK5uy_m9axrCQE_y5BW8xWZnBMQX4PL3AH02RmI"
    },
    "tracks": [
      "The Team",
      "The Oath"
    ]
  },
  {
    "slug": "high-speed",
    "title": "High Speed",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2022-07-15",
    "link": "https://sywavy.com/release.html?id=high-speed",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/5w2M6HZbxkGoIBNWCnN7MI",
      "apple": "https://music.apple.com/us/album/high-speed-single/1634319165?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=YvJFZwjHElw&list=OLAK5uy_mPcx8Aftj2OmXwgh1ayA0DYQknWwdfGYY",
      "soundcloud": "https://soundcloud.com/sywavy/high-speed?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    "songs": 1
  },
  {
    "slug": "japanese-cherry-blossom",
    "title": "Japanese Cherry Blossom",
    "artist": "SyWavy",
    "type": "Album",
    "date": "2022-04-15",
    "link": "https://sywavy.com/release.html?id=japanese-cherry-blossom",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/6Od5M29vOAG0Ls5cJTqlLY",
      "apple": "https://music.apple.com/us/album/japanese-cherry-blossom/1753204541?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=i1hygi2LiyE&list=OLAK5uy_kfK5dtZqFVoFRY8w6yUzd0x7P2SjI8M_g",
      "soundcloud": "https://soundcloud.com/sywavy/sets/japanese-cherry-blossom?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    "tracks": [
      "Overture",
      "Losing Petals",
      "Stigma",
      "Partake",
      "Chanel Fragrance",
      "Advisor",
      "Gold Tears",
      "Far",
      "Starfall",
      "Blossom",
      "Red Panda",
      "Dreamland",
      "Sable",
      "ShapeShift",
      "Postal"
    ]
  },
  {
    "slug": "night-glow",
    "title": "Night Glow",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2021-11-26",
    "link": "https://sywavy.com/release.html?id=night-glow",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/7txiS2K2OhoWTKbfEFTBwM",
      "apple": "https://music.apple.com/us/album/night-glow-single/1597280066?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=Je2exdjU_g8&list=OLAK5uy_kwpQYJbAU0qlFWGbltiUzsOFSTIAxI9pU"
    },
    "songs": 1
  },
  {
    "slug": "life-is-verses",
    "title": "Life Is Verses",
    "artist": "SyWavy",
    "type": "EP",
    "date": "2021-09-24",
    "link": "https://sywavy.com/release.html?id=life-is-verses",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/52BJgCNnqPTqCuku5odNvs",
      "apple": "https://music.apple.com/us/album/life-is-verses-ep/1586235736?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=B_Brv7zcLuA&list=OLAK5uy_kN-81wLbPhl2AQouNbE_BsVHUOJNQ4Skk"
    },
    "tracks": [
      "Under",
      "Nick Fury",
      "3AM",
      "Live is Verses",
      "Fall Out",
      "Jorja"
    ]
  },
  {
    "slug": "olympian",
    "title": "Olympian",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2021-07-02",
    "link": "https://sywavy.com/release.html?id=olympian",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/02davyhOLrc4t8QCiAH0I6",
      "apple": "https://music.apple.com/us/album/olympian-single/1573528940?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=RBwvApEWXHo&list=OLAK5uy_k11ZymaOWexYWk9jfH72OqE3lV3lZJIlU",
      "soundcloud": "https://soundcloud.com/sywavy/olympian?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    "songs": 1
  },
  {
    "slug": "hurts-to-heal",
    "title": "Hurts to Heal",
    "artist": "SyWavy",
    "type": "EP",
    "date": "2021-04-09",
    "link": "https://sywavy.com/release.html?id=hurts-to-heal",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/6xXRTYCgEO0ri7tlsJuhTR",
      "apple": "https://music.apple.com/us/album/hurts-to-heal-ep/1561704219?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=iohhT1O-uoE&list=OLAK5uy_lZKoyHpYB401u8FRtCeBHb0XlNLFtvVRo"
    },
    "tracks": [
      "7 Days",
      "Traffic",
      "Violet & Tate",
      "1123"
    ]
  },
  {
    "slug": "why-me",
    "title": "Why Me?",
    "artist": "SyWavy",
    "type": "EP",
    "date": "2021-01-15",
    "link": "https://sywavy.com/release.html?id=why-me",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/2COzO0DgaeNHGdb179ok5G",
      "apple": "https://music.apple.com/us/album/why-me-single/1548137979?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=1_kVZRAvuDk&list=OLAK5uy_mF_xJPU8NQaNPdeJHHDn5jS3zDbExSASg",
      "soundcloud": "https://soundcloud.com/sywavy/sets/why-me?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    "tracks": [
      "Why",
      "Me",
      "? (Cry)"
    ]
  },
  {
    "slug": "family-ties",
    "title": "Family Ties",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2020-12-09",
    "link": "https://sywavy.com/release.html?id=family-ties",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/25O2nPUI0yDmaTIcZvnkaM",
      "apple": "https://music.apple.com/us/album/family-ties-single/1543475801?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=BNCguCzvbMA&list=OLAK5uy_lUAiENfigxAYVhDOJl-9dqEA_6EOJU6L0"
    },
    "songs": 1
  },
  {
    "slug": "14th",
    "title": "14th",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2020-11-14",
    "link": "https://sywavy.com/release.html?id=14th",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/0gkbX42c7ApFBwXxZsn9T4",
      "apple": "https://music.apple.com/us/album/14th-single/1539246012?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=geIp4BKcUEI&list=OLAK5uy_mP90fpNATh02H5t8V-eWcAPyOJGWWDkfo"
    },
    "songs": 1
  },
  {
    "slug": "red-lights",
    "title": "Red Lights",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2020-09-19",
    "link": "https://sywavy.com/release.html?id=red-lights",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/376UoQExNo7YRabzRleAr3",
      "apple": "https://music.apple.com/us/album/red-lights-single/1531910812?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=RvWwIEGMDTw&list=OLAK5uy_lwvjUyIemkgjIwmgvhEwzryXHPKhuLGqw"
    },
    "songs": 1
  },
  {
    "slug": "saturn",
    "title": "Saturn",
    "artist": "SyWavy",
    "type": "EP",
    "date": "2020-08-14",
    "link": "https://sywavy.com/release.html?id=saturn",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/0WKRqsyrGo8MtsiRGmQBo8",
      "apple": "https://music.apple.com/us/album/saturn-single/1526896543?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=UmkWdmw2M0E&list=OLAK5uy_k6-gPuHWzZ5dBisE78fjr3C2Z3NkRYrY8"
    },
    "tracks": [
      "Float",
      "Love to See It"
    ]
  },
  {
    "slug": "ear-candi",
    "title": "Ear Candi",
    "artist": "SyWavy",
    "type": "EP",
    "date": "2020-06-27",
    "link": "https://sywavy.com/release.html?id=ear-candi",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/0tB8oADagNJ4Tu3SACF2Uo",
      "apple": "https://music.apple.com/us/album/ear-candi-ep/1519819721?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=T5Ei0zREmnE&list=OLAK5uy_n84dtpPlF7MdMGgrg0t3yZky-3M3uxE9U"
    },
    "tracks": [
      "Joy",
      "Weeknd",
      "Peace of Mind",
      "I Know",
      "No Change"
    ]
  },
  {
    "slug": "keys",
    "title": "Keys",
    "artist": "SyWavy",
    "type": "Single",
    "date": "2020-03-28",
    "link": "https://sywavy.com/release.html?id=keys",
    "streamingLinks": {
      "spotify": "https://open.spotify.com/album/4YTpjeI5wwDuqxhHOpiby9",
      "apple": "https://music.apple.com/us/album/keys-single/1504976583?uo=4&app=music&at=1001lry3&ct=dashboard",
      "youtube": "https://www.youtube.com/watch?v=yzqRsJyZNY4&list=OLAK5uy_mQVqMiGCKTTOBaXnBHWr0XUmZX3UTdJBQ",
      "soundcloud": "https://soundcloud.com/sywavy/keys?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    "songs": 1
  }
];

/* Official videos. id = the YouTube video id. The first entry is featured on the home page. */
window.VIDEOS = [
  { "id": "cNYZxzDjoUE", "title": "Carolina Herrera", "artist": "SyWavy", "kind": "Official Music Video", "release": "magnum-opus" },
  { "id": "EEbRq_fPUnE", "title": "SZA", "artist": "SyWavy", "kind": "Official Music Video", "release": "magnum-opus" }
];

window.PLAYLISTS = {
  youtube: "PL432doK1hhpubIcc0Kdg3wfapa7ErJLAR",
  spotify: "https://open.spotify.com/playlist/3A7pDOj3iWVYk1KKR8LjWJ"
};

/* Film work: sound design and original score. The "Sound for film" section on the
   home page and the videos page appears automatically once this has an entry.
   Fields: title, year, role, runtime, director (optional), note (optional one line),
   and either youtube (a YouTube video id) or url (any external link).
   Optional poster: a path under /images/ used instead of the YouTube thumbnail. */
window.FILMS = [
  // { "title": "Short film title", "year": "2026", "role": "Original score & sound design", "runtime": "12 min", "director": "Director name", "youtube": "VIDEO_ID" }
];
