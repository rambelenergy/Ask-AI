function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mb-7 text-[18px] leading-9 text-slate-700">{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 mt-12 text-[34px] font-bold tracking-tight text-[var(--navy)]">{children}</h2>;
}

export function ArticleBody() {
  return (
    <article>
      <Paragraph>
        The proposed Nigeria&ndash;Algeria&ndash;Europe gas pipeline is more than an infrastructure discussion. It represents a strategic question about how African resources, Algerian transit capacity, and European energy demand could be connected in a period of market uncertainty and energy security realignment.
      </Paragraph>
      <Paragraph>
        For Europe, the search for reliable and diversified energy partners has placed renewed attention on North Africa and the wider Mediterranean. For Algeria, the route highlights the country&rsquo;s potential role as both a producer and a strategic bridge between sub-Saharan supply potential and European consumption centers.
      </Paragraph>

      <SectionTitle>Strategic Importance</SectionTitle>
      <Paragraph>
        The strategic importance of the corridor lies in its ability to connect long-term African gas potential with European diversification needs. It could support supply security while also reinforcing the Mediterranean as a practical route for energy cooperation between Africa and Europe.
      </Paragraph>
      <Paragraph>
        However, the project&rsquo;s significance should not be understood only through volumes or distance. Its value also depends on financing, political coordination, regional stability, technical feasibility, and the ability of participating states to align infrastructure planning with market realities.
      </Paragraph>

      <SectionTitle>Algeria&rsquo;s Role as an Energy Hub</SectionTitle>
      <Paragraph>
        Algeria already holds an important position in Europe&rsquo;s energy geography through pipeline links, LNG capacity, and long-standing relationships with Southern European markets. A future corridor from Nigeria through Algeria would reinforce this role and strengthen Algeria&rsquo;s position as a Mediterranean energy hub.
      </Paragraph>
      <Paragraph>
        This role would not be limited to transit. Algeria&rsquo;s domestic gas production, infrastructure experience, and diplomatic position could make it a central actor in shaping how African energy resources are connected with European energy security priorities.
      </Paragraph>

      <SectionTitle>Italy and Spain as Key Destinations</SectionTitle>
      <Paragraph>
        Italy and Spain are important destinations because of their geographic proximity, existing infrastructure links, and role as gateways to wider European markets. Both countries sit at the intersection of Mediterranean energy flows, supply diversification, and transition-oriented policy planning.
      </Paragraph>
      <Paragraph>
        Their position could make them key beneficiaries of strengthened Algeria&ndash;Europe energy cooperation, particularly if the corridor is developed alongside broader investments in interconnections, LNG flexibility, renewable energy, and long-term sustainability partnerships.
      </Paragraph>

      <SectionTitle>Risks and Opportunities</SectionTitle>
      <Paragraph>
        The opportunities are significant: improved energy diversification, deeper Euro-African cooperation, stronger regional infrastructure, and expanded strategic relevance for Algeria. Yet the risks are equally important. Political stability, security along the route, financing, environmental considerations, and market demand must all be addressed carefully.
      </Paragraph>
      <Paragraph>
        The corridor&rsquo;s future will depend on whether stakeholders can combine infrastructure ambition with practical policy coordination, credible investment frameworks, and a long-term view of both gas security and sustainability transition.
      </Paragraph>

      <SectionTitle>Conclusion</SectionTitle>
      <Paragraph>
        The Nigeria&ndash;Algeria&ndash;Europe gas pipeline remains a complex but strategically important idea. For RamBelEnergy, the key issue is not whether the route should be viewed as a simple solution, but how it reflects deeper changes in Europe&rsquo;s energy priorities, Algeria&rsquo;s regional role, and Africa&rsquo;s position in future energy cooperation.
      </Paragraph>
      <Paragraph>
        If developed responsibly, the corridor could become part of a wider energy relationship that includes gas infrastructure, renewable energy, sustainability planning, and strategic cooperation between Africa and Europe.
      </Paragraph>
    </article>
  );
}
