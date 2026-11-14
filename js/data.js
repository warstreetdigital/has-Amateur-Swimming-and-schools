/**
 * HAS DIGITAL MEDAL VAULT — OFFICIAL ATHLETE RECORD
 * Harare Amateur Swimming (HAS) · 2026–2027 Season
 * Permanent archival record attached to physical medal HAS-2026-0001
 */

window.HAS_MEDAL_VAULT = {
  "HAS-2026-0001": {
    athlete: {
      name: "Arya Dinar",
      ageGroup: "Under 18",
      club: "Harare Aquatics Club",
      clubAbbr: "HAC",
      avatarInitials: "AD"
    },
    medal: {
      tier: "Gold",
      type: "Gold Medal",
      achievementId: "HAS-2026-0001",
      season: "2026–2027",
      seasonShort: "2026–27",
      competition: "Harare Amateur Swimming Championships",
      competitionShort: "HAS Championships",
      organization: "Harare Amateur Swimming (HAS)",
      organizationAbbr: "HAS",
      date: "15 August 2026",
      venue: "Harare International School Aquatic Centre",
      city: "Harare, Zimbabwe"
    },
    achievement: {
      event: "50m Freestyle",
      round: "Final",
      position: "1st Place",
      officialTime: "00:28.42",
      heat: 3,
      lane: 4,
      timingMethod: "Certified Electronic Touch Pad · Official Record",
      recordType: "Championship Gold"
    },
    club: {
      name: "Harare Aquatics Club",
      tagline: "Represented by Arya Dinar at this achievement.",
      established: "Harare, Zimbabwe",
      affiliation: "Harare Amateur Swimming (HAS)"
    },
    digitalRecord: {
      verificationId: "HAS-2026-0001",
      certifiedDate: "15 August 2026",
      status: "Certified Official Record",
      authority: "Harare Amateur Swimming (HAS)",
      venue: "Harare International School Aquatic Centre"
    },
    media: {
      medalFront: "assets/images/has-gold-medal.svg",
      medalReverse: "assets/images/has-gold-medal-reverse.svg",
      homePortrait: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/arya-home-portrait.webp",
      race: {
        title: "50m Freestyle Final",
        medalLabel: "Gold Medal",
        season: "2026–2027 Season",
        videoUrl: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/7%20year%20old%2050m%20freestyle.mp4",
        posterUrl: "",
        duration: "00:28.42",
        heat: 3,
        lane: 4,
        statusText: "Official Race Footage",
        additionalVideos: []
      },
      moments: {
        competitionDay: {
          label: "Race Day",
          description: "The moments surrounding Arya's race.",
          photos: [
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/01_competition_atmosphere.webp",
              caption: "Competition Atmosphere"
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/02_swimmers_on_starting_blocks.webp",
              caption: "Swimmers on Starting Blocks"
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/03_race_start_dive.webp",
              caption: "Race Start"
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/04_freestyle_race_underway.webp",
              caption: "Freestyle Race Underway"
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/05_swimmer_freestyle_closeup.webp",
              caption: "Freestyle Close-up"
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/06_race_midway_wide_view.webp",
              caption: "Race Midway"
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/07_final_stretch.webp",
              caption: "Final Stretch"
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/08_finish_at_pool_wall.webp",
              caption: "Finish at Pool Wall"
            }
          ],
          videos: []
        },
        podiumMedal: {
          label: "The Podium",
          description: "The moment the achievement became a memory.",
          coverUrl: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/11_gold_medal_winner_portrait.webp",
          photos: [
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/09_gold_medal_award_presentation.webp",
              caption: "The moment Arya received her gold medal."
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/10_medal_winners_group_portrait.webp",
              caption: "A celebration alongside fellow medal winners."
            },
            {
              url: "https://pub-151ed170a5754076bd5f6acdb5f96429.r2.dev/schools%20swimming/HAS_2026-2027_swimming_memories_webp/11_gold_medal_winner_portrait.webp",
              caption: "Arya Dinar — Gold Medal Winner · 2026–2027 Season"
            }
          ],
          videos: []
        },
        behindTheScenes: {
          label: "Behind the Scenes",
          photos: [],
          videos: []
        },
        specialMoments: {
          label: "Special Moments",
          photos: [],
          videos: []
        }
      }
    }
  }
};

/**
 * Accessor function to retrieve medal record by ID
 */
window.getMedalVaultRecord = function (id) {
  const normalizedId = (id || "HAS-2026-0001").toUpperCase();
  return window.HAS_MEDAL_VAULT[normalizedId] || window.HAS_MEDAL_VAULT["HAS-2026-0001"];
};
