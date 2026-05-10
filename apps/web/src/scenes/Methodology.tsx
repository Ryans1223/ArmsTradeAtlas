export default function Methodology() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-12">
        <header className="mb-10">
          <h1 className="font-serif text-headline font-semibold text-parchment mb-3">Methodology</h1>
          <p className="font-serif text-body-lg text-parchment/70 italic">
            What this data can show, what it cannot, and how to read it honestly.
          </p>
        </header>

        <article className="editorial-body space-y-6 text-parchment/85">
          <section>
            <h2 className="font-serif text-xl font-semibold text-parchment mb-3">What is TIV?</h2>
            <p>
              All figures on this site are expressed in SIPRI Trend Indicator Values (TIV), measured in
              millions of constant 1990 US dollars. TIV is not a sales price. It is a proxy developed by
              the Stockholm International Peace Research Institute to allow comparisons of arms transfer
              volumes across time and across weapon types.
            </p>
            <p className="mt-3">
              SIPRI assigns each weapon system a TIV based on the cost of producing a comparable weapon
              in 1990. A secondhand T-55 tank transferred from Russia to a sub-Saharan client, for instance,
              carries a far lower TIV than a new M1A2 Abrams, even if the secondhand tank was transferred
              for free and the Abrams was sold at full commercial price. TIV captures delivered military
              capability, not financial transactions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-parchment mb-3">
              SIPRI's data collection methodology
            </h2>
            <p>
              SIPRI researchers compile the Arms Transfers Database from open sources: government reports,
              parliamentary debates, military journals, trade publications, and news reporting. Entries are
              verified against multiple independent sources before inclusion. When delivery quantities are
              disputed or unclear, SIPRI uses conservative estimates and notes the uncertainty.
            </p>
            <p className="mt-3">
              The database covers major conventional weapons: aircraft, armored vehicles, artillery,
              radar and sensor systems, missiles, and naval vessels. It does not cover small arms, light
              weapons, ammunition, or dual-use technology in isolation. This means the true scale of arms
              flows, especially to conflict zones supplied by local production or informal networks, is
              systematically underrepresented.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-parchment mb-3">
              How this site handles historical states
            </h2>
            <p>
              Several significant arms suppliers and recipients no longer exist as sovereign states: the
              Soviet Union, Yugoslavia, Czechoslovakia, East Germany, South Vietnam, and North Yemen, among
              others. This site maps those historical entities to display names and, where relevant, notes
              their successor states. Transfers attributed to the USSR appear under that label; no attempt
              is made to allocate them to Russia or other successor states, as the decision logic would be
              speculative.
            </p>
            <p className="mt-3">
              Taiwan presents a specific challenge: SIPRI includes it as a recipient, but many states do
              not formally recognize it. This site displays Taiwan as a separate entity consistent with the
              SIPRI data without taking a position on sovereignty questions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-parchment mb-3">
              What this data cannot show
            </h2>
            <p>
              The gaps in the SIPRI database are as analytically important as its contents. Several
              categories of arms transfer are absent or systematically underrepresented:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                <strong className="text-parchment">Covert transfers.</strong> CIA and KGB arms pipelines
                during the Cold War, particularly through third-country proxies (e.g., Saudi-financed US
                weapons to Afghan mujahideen, or Soviet arms laundered through Libya to Palestinian
                factions), appear partially or not at all.
              </li>
              <li>
                <strong className="text-parchment">Financial military aid.</strong> When the United States
                provides Foreign Military Financing that a recipient uses to purchase weapons from a third
                country, the dollar flow may not generate a SIPRI entry traceable to the US.
              </li>
              <li>
                <strong className="text-parchment">North Korean exports.</strong> SIPRI researchers document
                known DPRK transfers, but the opacity of that state's arms industry means the database
                almost certainly understates its actual export volume.
              </li>
              <li>
                <strong className="text-parchment">Dual-use technology.</strong> Engine components,
                guidance electronics, propellants, and manufacturing equipment that enable weapons production
                do not appear in TIV unless they are transferred as part of a weapons system.
              </li>
              <li>
                <strong className="text-parchment">Reporting lag.</strong> Recent years (typically the last
                two to three) are less complete than historical data. Deliveries that have occurred but not
                yet been publicly confirmed will not appear.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-parchment mb-3">A note on interpretation</h2>
            <p>
              High TIV values indicate large volumes of delivered military hardware. They do not indicate
              effectiveness, stability outcomes, or the intentions of the supplying state. The United States
              supplied Iran with over $10 billion in TIV value before 1979; those weapons did not produce
              the outcome Washington intended. The Soviet Union spent enormous resources arming Egypt, then
              lost its influence there anyway. Arms transfers are instruments of foreign policy, but they
              are unreliable ones. The data shows the transfers; the case studies attempt to show what
              happened as a result.
            </p>
          </section>

          <section className="border-t border-ink-light/50 pt-6">
            <h2 className="font-serif text-xl font-semibold text-parchment mb-3">Citation</h2>
            <p className="font-mono text-caption text-parchment/60 bg-ink-light/30 p-3 rounded-sm leading-relaxed">
              SIPRI Arms Transfers Database. Stockholm International Peace Research Institute (SIPRI),
              accessed 2024. Available at sipri.org/databases/armstransfers. TIV values are a SIPRI-defined
              proxy for transfer volume; they are not equivalent to financial sales prices or procurement
              costs. Users should consult the SIPRI methodology note for full definitions.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
