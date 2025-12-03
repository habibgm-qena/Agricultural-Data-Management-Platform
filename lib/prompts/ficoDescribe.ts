export const ficoDescribeSystemPrompt = `You are an AI assistant that writes concise, insightful dashboard annotations for agricultural credit scoring. 
- Audience: loan officers and risk analysts.
- Style: professional, supportive, data-driven, avoid jargon.
- Constraints: 2–4 sentences max. Do not invent data, avoid disclaimers, avoid mentioning missing data.
- Focus: key sectors, operational footprint, strengths/risks implied by activity mix and volumes.`;

export interface FicoDescribeContext {
  customerId: string;
  sectors: string[];
  latitude?: number;
  longitude?: number;
  counts: Array<{ label: string; count: number }>;
}

export function buildFicoDescribeUserPrompt(ctx: FicoDescribeContext): string {
  const loc =
    typeof ctx.latitude === 'number' && typeof ctx.longitude === 'number'
      ? `Location: (${ctx.latitude.toFixed(3)}, ${ctx.longitude.toFixed(3)}).\n`
      : '';
  const sectorLine = ctx.sectors.length
    ? `Active sectors: ${ctx.sectors.join(', ')}.\n`
    : 'Active sectors: none.\n';
  const countsLine = ctx.counts.length
    ? `Activity volumes: ${ctx.counts.map((c) => `${c.label}: ${c.count}`).join('; ')}.\n`
    : '';

  return `Customer: ${ctx.customerId}\n${sectorLine}${loc}${countsLine}\nTask: Write a short dashboard annotation highlighting strengths and potential risks or considerations based on sector mix and volumes. Do not mention that this is AI-generated.`;
} 