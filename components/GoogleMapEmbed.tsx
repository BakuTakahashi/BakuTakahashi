interface Props {
  query: string;
  height?: number;
}

export function GoogleMapEmbed({ query, height = 380 }: Props) {
  const encoded = encodeURIComponent(query);
  const src = `https://www.google.com/maps?q=${encoded}&output=embed`;
  const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  return (
    <div className="space-y-2">
      <iframe
        title={`Google Maps: ${query}`}
        src={src}
        width="100%"
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="rounded-xl border border-slate-200"
      />
      <a
        href={externalUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-block text-xs font-semibold text-brand hover:underline"
      >
        Googleマップで開く（口コミ・写真・経路）→
      </a>
    </div>
  );
}
