import type { CaseStudy } from '@arms-atlas/types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'us-iran-shah',
    title: 'America and the Shah: Arms, Oil, and the Fall of Iran',
    subtitle: 'How the United States made Iran its anchor in the Persian Gulf, then watched it collapse.',
    yearRange: { from: 1953, to: 1979 },
    highlightedCountries: ['USA', 'IRN'],
    keyNumbers: [
      {
        value: '$11.2B',
        label: 'in TIV value of US arms to Iran, 1970 to 1978',
        context: 'More than any other non-NATO recipient in that window, per SIPRI records.',
      },
      {
        value: '1973',
        label: 'Year Nixon authorized Iran to purchase any conventional US weapon',
        context: 'Following the oil shock, the Shah leveraged petrodollars for a massive military buildup.',
      },
      {
        value: '$20B',
        label: 'in US arms orders placed by Iran between 1972 and 1977',
        context: 'Estimated by the Congressional Budget Office; TIV data captures delivered hardware only.',
      },
    ],
    narrativeBlocks: [
      {
        id: 'us-iran-1',
        text: 'The 1953 CIA-backed coup that restored Mohammad Reza Shah Pahlavi to the Peacock Throne created a durable strategic partnership. Iran sat at the junction of the Soviet southern flank and the Persian Gulf oil lanes. For Washington, keeping it armed and stable was not a favor but a necessity.',
        mapState: {
          yearRange: { from: 1953, to: 1960 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['IRN'],
          annotation: 'Early US military assistance programs establish the pattern.',
        },
      },
      {
        id: 'us-iran-2',
        text: 'Through the 1960s, the Shah pursued a Defense Industries Organization and pushed for increasingly sophisticated hardware. The US supplied F-4 Phantoms, M-60 tanks, and advanced radar systems, positioning Iran as a regional hegemon that could protect Gulf oil flows without requiring American boots on the ground.',
        mapState: {
          yearRange: { from: 1961, to: 1972 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['IRN'],
          annotation: 'F-4 Phantoms, M-60 tanks, and naval frigates flow south.',
        },
      },
      {
        id: 'us-iran-3',
        text: 'The 1973 oil embargo changed the arithmetic. Iran\'s petrodollar revenues surged, and Nixon signed a secret directive allowing the Shah to purchase any conventional US weapon system without the normal case-by-case review. Arms deliveries in the mid-1970s reached a scale that alarmed even Congressional critics.',
        mapState: {
          yearRange: { from: 1973, to: 1976 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['IRN'],
          annotation: 'Post-oil shock surge: F-14 Tomcats, AWACS, Spruance-class destroyers ordered.',
        },
      },
      {
        id: 'us-iran-4',
        text: 'When the revolution came in 1979, the most advanced US weapons in Iranian hands became a strategic liability. Parts were cut off, classified systems were at risk of Soviet exploitation, and the Iranian Air Force flew F-14 Tomcats whose maintenance America refused to support. The billions in TIV value transferred over 25 years now sat behind enemy lines.',
        mapState: {
          yearRange: { from: 1977, to: 1979 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['IRN'],
          annotation: 'Revolution ends deliveries. Undelivered orders are seized or cancelled.',
        },
      },
    ],
    sources: [
      { label: 'SIPRI Arms Transfers Database', url: 'https://www.sipri.org/databases/armstransfers' },
      { label: 'Andrew, Christopher: "For the President\'s Eyes Only" (1995)', url: 'https://www.worldcat.org/title/for-the-presidents-eyes-only' },
      { label: 'Gasiorowski, Mark: "U.S. Foreign Policy and the Shah" (1991)', url: 'https://www.worldcat.org/title/us-foreign-policy-and-the-shah' },
      { label: 'Senate Foreign Relations Committee Hearings on US Arms Sales to Iran (1976)', url: 'https://www.congress.gov/' },
    ],
  },
  {
    slug: 'soviet-egypt-syria',
    title: 'Moscow\'s Middle Eastern Gamble: Arms for Influence in Egypt and Syria',
    subtitle: 'From Nasser\'s overtures to Sadat\'s expulsion: the Soviet Union\'s costly bid for Arab alignment.',
    yearRange: { from: 1955, to: 1991 },
    highlightedCountries: ['SUN', 'EGY', 'SYR'],
    keyNumbers: [
      {
        value: '1955',
        label: 'Year of the Czech arms deal that broke the Western monopoly on Arab armament',
        context: 'Nasser formally negotiated through Czechoslovakia, but the weapons were Soviet.',
      },
      {
        value: '1972',
        label: 'Year Sadat expelled 20,000 Soviet military advisors from Egypt',
        context: 'The expulsion followed Soviet refusal to supply offensive weapons before the Yom Kippur War.',
      },
      {
        value: '$10B+',
        label: 'Estimated Soviet military aid to Egypt and Syria, 1955 to 1973',
        context: 'Much was forgiven debt; TIV captures hardware volume, not financial terms.',
      },
    ],
    narrativeBlocks: [
      {
        id: 'sov-mid-1',
        text: 'The 1955 Czech arms deal was a turning point in Cold War geopolitics. Gamal Abdel Nasser, humiliated by Western refusals to arm Egypt after the 1948 war, turned east. Moscow saw an opening: arms could purchase influence in a region it had been locked out of since World War II.',
        mapState: {
          yearRange: { from: 1955, to: 1960 },
          highlightedSupplier: 'SUN',
          highlightedRecipients: ['EGY', 'SYR'],
          annotation: 'MiG-15s, T-34 tanks, and Ilyushin bombers arrive. The Western monopoly breaks.',
        },
      },
      {
        id: 'sov-mid-2',
        text: 'After the 1967 Six-Day War disaster, Soviet resupply was massive and rapid. Moscow airlifted replacement equipment within weeks and committed to rebuilding Arab military capacity. Syria became a particularly important client as Soviet advisors embedded at every level of the Syrian Arab Air Force.',
        mapState: {
          yearRange: { from: 1967, to: 1971 },
          highlightedSupplier: 'SUN',
          highlightedRecipients: ['EGY', 'SYR'],
          annotation: 'Post-1967 emergency resupply. MiG-21s, SAM batteries, and T-55 tanks flood in.',
        },
      },
      {
        id: 'sov-mid-3',
        text: 'The October 1973 Yom Kippur War tested Soviet influence. Despite the massive hardware presence, Moscow was caught off-guard by Sadat\'s willingness to go to war. When Israel pushed back, a superpower confrontation loomed. The US and USSR both resupplied their clients in a frantic airlift competition.',
        mapState: {
          yearRange: { from: 1973, to: 1973 },
          highlightedSupplier: 'SUN',
          highlightedRecipients: ['EGY', 'SYR'],
          annotation: 'October War: largest tank battle since Kursk. Soviet resupply airlift begins October 14.',
        },
      },
      {
        id: 'sov-mid-4',
        text: 'After the war, Egypt pivoted toward the United States. Sadat\'s expulsion of Soviet advisors in 1972 had foreshadowed what the Camp David Accords confirmed in 1978: Egypt was lost to Moscow. Syria remained a client, but the investment had yielded, at best, partial influence over a state that pursued its own agenda.',
        mapState: {
          yearRange: { from: 1974, to: 1991 },
          highlightedSupplier: 'SUN',
          highlightedRecipients: ['SYR'],
          annotation: 'Egypt exits the Soviet orbit. Syria remains, but the investment calculus turns negative.',
        },
      },
    ],
    sources: [
      { label: 'SIPRI Arms Transfers Database', url: 'https://www.sipri.org/databases/armstransfers' },
      { label: 'Glassman, Jon: "Arms for the Arabs" (1975)', url: 'https://www.worldcat.org/title/arms-for-the-arabs' },
      { label: 'Heikal, Mohamed: "The Sphinx and the Commissar" (1978)', url: 'https://www.worldcat.org/title/the-sphinx-and-the-commissar' },
      { label: 'Golan, Galia: "Soviet Policies in the Middle East" (1990)', url: 'https://www.worldcat.org/title/soviet-policies-in-the-middle-east' },
    ],
  },
  {
    slug: 'angola-proxy',
    title: 'Angola: The Cold War\'s Bloodiest Arms Bazaar',
    subtitle: 'How the US, USSR, Cuba, South Africa, and China all poured weapons into one post-colonial civil war.',
    yearRange: { from: 1975, to: 1991 },
    highlightedCountries: ['USA', 'SUN', 'CUB', 'ZAF', 'AGO'],
    keyNumbers: [
      {
        value: '1975',
        label: 'Year of Angolan independence; three armed factions immediately contested power',
        context: 'MPLA (Soviet and Cuban backed), FNLA (US and Chinese backed), UNITA (US and South African backed).',
      },
      {
        value: '27 years',
        label: 'Duration of the Angolan Civil War (1975 to 2002)',
        context: 'One of the longest Cold War proxy conflicts; arms kept flowing long after superpower interest faded.',
      },
      {
        value: '~500,000',
        label: 'Estimated deaths in the civil war',
        context: 'Per the Uppsala Conflict Data Program; the exact toll remains contested by historians.',
      },
    ],
    narrativeBlocks: [
      {
        id: 'angola-1',
        text: 'Portugal\'s 1974 Carnation Revolution collapsed its African empire. In Angola, three liberation movements had been fighting the Portuguese for a decade; now they turned on each other. The MPLA held Luanda. The FNLA and UNITA held hinterland. All three had foreign patrons eager to shape the outcome.',
        mapState: {
          yearRange: { from: 1975, to: 1975 },
          highlightedSupplier: 'SUN',
          highlightedRecipients: ['AGO'],
          annotation: 'Soviet and Cuban weapons begin arriving for MPLA. US CIA covert aid flows to FNLA and UNITA.',
        },
      },
      {
        id: 'angola-2',
        text: 'The Cuban intervention was the decisive military factor in the first phase. By November 1975, 36,000 Cuban troops were in Angola with Soviet equipment. South Africa, which had invaded from the south to support UNITA and prevent an Angolan Communist state on its border, withdrew under international pressure and the Clark Amendment cut US covert aid.',
        mapState: {
          yearRange: { from: 1975, to: 1976 },
          highlightedSupplier: 'CUB',
          highlightedRecipients: ['AGO'],
          annotation: 'Cuban troops and Soviet T-54 tanks stabilize MPLA hold on Luanda.',
        },
      },
      {
        id: 'angola-3',
        text: 'The Reagan administration resumed covert aid to UNITA in 1986 under the Reagan Doctrine. South Africa resumed its military involvement, and the conflict escalated into the Battle of Cuito Cuanavale (1987 to 1988), one of Africa\'s largest conventional battles since World War II. The battle ended in a negotiated settlement that set the stage for Cuban withdrawal and, eventually, Namibian independence.',
        mapState: {
          yearRange: { from: 1985, to: 1988 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['AGO'],
          annotation: 'Stinger missiles, anti-tank weapons, and logistics support reach UNITA via Zaire.',
        },
      },
    ],
    sources: [
      { label: 'SIPRI Arms Transfers Database', url: 'https://www.sipri.org/databases/armstransfers' },
      { label: 'Gleijeses, Piero: "Conflicting Missions: Havana, Washington, and Africa" (2002)', url: 'https://www.worldcat.org/title/conflicting-missions' },
      { label: 'Stockwell, John: "In Search of Enemies" (1978)', url: 'https://www.worldcat.org/title/in-search-of-enemies' },
      { label: 'Council on Foreign Relations: Angola', url: 'https://www.cfr.org/' },
    ],
  },
  {
    slug: 'ukraine-2022',
    title: 'Arming Ukraine: Western Military Support Since the 2022 Invasion',
    subtitle: 'The fastest large-scale arms transfer to an active warzone since the 1973 Yom Kippur airlift.',
    yearRange: { from: 2022, to: 2025 },
    highlightedCountries: ['USA', 'UKR', 'GBR', 'DEU', 'POL'],
    keyNumbers: [
      {
        value: '$75B+',
        label: 'in total US assistance to Ukraine, 2022 to 2024',
        context: 'Includes military, economic, and humanitarian aid; per the Kiel Institute Ukraine Support Tracker.',
      },
      {
        value: '31',
        label: 'M1 Abrams main battle tanks committed by the US in 2023',
        context: 'Germany\'s simultaneous Leopard 2 commitments unlocked a broader Western tank coalition.',
      },
      {
        value: '40+',
        label: 'Countries contributing military aid to Ukraine as of 2024',
        context: 'Per the Ukraine Defense Contact Group (Ramstein format).',
      },
    ],
    narrativeBlocks: [
      {
        id: 'ukr-1',
        text: 'When Russia launched its full-scale invasion on February 24, 2022, the initial US intelligence assessment was that Kyiv would fall within days. Instead, Ukrainian forces held. Western governments, initially cautious, began escalating aid rapidly as Ukrainian resistance proved durable.',
        mapState: {
          yearRange: { from: 2022, to: 2022 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['UKR'],
          annotation: 'First tranches: Javelin ATGMs, Stinger MANPADS, small arms, and ammunition.',
        },
      },
      {
        id: 'ukr-2',
        text: 'The aid escalation followed a pattern: each Ukrainian request for a category of weapon was first rejected as escalatory, then provided weeks or months later as battlefield necessity overcame political hesitation. HIMARS multiple-rocket launchers, NASAMS air defense, Bradley IFVs, Patriot batteries, F-16s: each crossed a threshold the prior month had seemed impossible.',
        mapState: {
          yearRange: { from: 2022, to: 2023 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['UKR'],
          annotation: 'HIMARS change the operational calculus in summer 2022. Air defense systems follow.',
        },
      },
      {
        id: 'ukr-3',
        text: 'The scale of Western military assistance has no post-1945 precedent for speed and volume. Kiel Institute tracking shows the coalition has committed more than $200B in all forms of aid within two years. SIPRI TIV data, which captures hardware delivery volume, will likely show this as the largest single-recipient surge in the database\'s history when fully reported.',
        mapState: {
          yearRange: { from: 2023, to: 2025 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['UKR'],
          annotation: 'Tanks, jets, long-range missiles, and integrated air defense form a multi-domain capability.',
        },
      },
    ],
    sources: [
      { label: 'SIPRI Arms Transfers Database', url: 'https://www.sipri.org/databases/armstransfers' },
      { label: 'Kiel Institute Ukraine Support Tracker', url: 'https://www.ifw-kiel.de/topics/war-against-ukraine/ukraine-support-tracker/' },
      { label: 'CSIS: Ukraine Aid Tracker', url: 'https://www.csis.org/' },
      { label: 'Brookings Institution: Ukraine War Analysis', url: 'https://www.brookings.edu/' },
    ],
  },
  {
    slug: 'us-israel',
    title: 'The Long Arc: US Military Support for Israel, 1948 to Present',
    subtitle: 'Seven decades of arms transfers, from Czech rifles to Iron Dome and beyond.',
    yearRange: { from: 1948, to: 2025 },
    highlightedCountries: ['USA', 'ISR'],
    keyNumbers: [
      {
        value: '$3.8B',
        label: 'Annual US Foreign Military Financing to Israel (since 2016 MOU)',
        context: 'Per the 10-year Memorandum of Understanding signed by Obama and Netanyahu in 2016.',
      },
      {
        value: '$14.5B',
        label: 'in US emergency military aid appropriated for Israel, October 2023 to 2024',
        context: 'Per Congressional Research Service; the largest single-year appropriation since the 1973 Yom Kippur emergency airlift.',
      },
      {
        value: '1973',
        label: 'Year of Operation Nickel Grass: the US airlift that decided the Yom Kippur War',
        context: 'The US airlifted 22,325 tons of equipment in 32 days, replacing Israeli losses and ensuring the ceasefire occurred before a decisive Egyptian or Syrian breakthrough.',
      },
    ],
    narrativeBlocks: [
      {
        id: 'isr-1',
        text: 'Israel was not a major US arms recipient in its early years. The 1948 War of Independence was fought with Czech weapons, surplus World War II equipment, and arms smuggled past a UN embargo. France, not the United States, was Israel\'s primary arms supplier through the 1950s and early 1960s, providing the Mystere and Mirage jets that dominated the 1967 war.',
        mapState: {
          yearRange: { from: 1948, to: 1966 },
          highlightedSupplier: 'FRA',
          highlightedRecipients: ['ISR'],
          annotation: 'France is Israel\'s primary supplier. US role is limited to economic aid and political support.',
        },
      },
      {
        id: 'isr-2',
        text: 'The 1967 Six-Day War and De Gaulle\'s arms embargo transformed the relationship. The United States became Israel\'s primary supplier, providing A-4 Skyhawks and F-4 Phantoms. The 1973 Yom Kippur War, with its US emergency airlift, cemented the relationship as a strategic guarantee, not merely a commercial arrangement.',
        mapState: {
          yearRange: { from: 1967, to: 1973 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['ISR'],
          annotation: 'Operation Nickel Grass, October 1973: 567 US military flights in 32 days.',
        },
      },
      {
        id: 'isr-3',
        text: 'The Camp David Accords (1978) institutionalized the aid relationship: US military assistance to Israel and Egypt became a paired commitment. Throughout the 1980s and 1990s, the US and Israel deepened coproduction relationships, with Israeli defense firms gaining access to US technology and US firms gaining Israeli combat-proven innovations.',
        mapState: {
          yearRange: { from: 1978, to: 2000 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['ISR'],
          annotation: 'F-15s, F-16s, Apache helicopters, and joint R&D programs define the mature relationship.',
        },
      },
      {
        id: 'isr-4',
        text: 'After the October 7, 2023 Hamas attack, the United States moved immediately to provide emergency military assistance. The scale and speed of the 2023 to 2024 transfers, combined with the contested nature of the conflict in Gaza, generated unprecedented Congressional and public debate about the conditions and accountability mechanisms governing US military aid.',
        mapState: {
          yearRange: { from: 2023, to: 2025 },
          highlightedSupplier: 'USA',
          highlightedRecipients: ['ISR'],
          annotation: 'Emergency appropriations: artillery shells, precision munitions, air defense interceptors.',
        },
      },
    ],
    sources: [
      { label: 'SIPRI Arms Transfers Database', url: 'https://www.sipri.org/databases/armstransfers' },
      { label: 'Congressional Research Service: US Foreign Aid to Israel (updated 2024)', url: 'https://crsreports.congress.gov/' },
      { label: 'Bard, Mitchell: "The Complete History of the Holocaust" (cross-reference: US-Israel relations)', url: 'https://www.worldcat.org/' },
      { label: 'Council on Foreign Relations: US-Israel Relations', url: 'https://www.cfr.org/israel' },
      { label: 'Brookings Institution: US Policy in the Middle East', url: 'https://www.brookings.edu/' },
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}
