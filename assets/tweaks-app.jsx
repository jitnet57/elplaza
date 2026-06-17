/* Tweaks app — 3 expressive controls that reshape the whole feel.
   Mounts only the floating panel; applies values to <html> so the
   vanilla page re-themes via CSS vars + data-attributes. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#33503F", "#C2784B", "#FAF6EF"],
  "headline": "elegant",
  "shape": "editorial"
}/*EDITMODE-END*/;

// Color moods — keyed by the palette's hero color (palette[0]).
const MOODS = {
  // 포레스트 — deep healing green (default)
  "#33503F": {
    "--forest": "#33503F", "--forest-deep": "#243A2D", "--forest-2": "#436450",
    "--sage": "#7E9379", "--sage-soft": "#A9BBA0",
    "--clay": "#C2784B", "--clay-deep": "#A6603A",
    "--gold": "#B08A4F", "--gold-soft": "#CDA86B",
    "--bg": "#FAF6EF", "--bg-2": "#F1E9DA", "--bg-3": "#ECE2CF",
    "--hero-1": "#3C5A47", "--hero-2": "#2B4435", "--hero-3": "#1E3127",
    "--hero-tint": "20,32,25"
  },
  // 선셋 — warm terracotta & golden hour
  "#BC5A3C": {
    "--forest": "#BC5A3C", "--forest-deep": "#7E3B28", "--forest-2": "#C96D4A",
    "--sage": "#CC8B69", "--sage-soft": "#E2B89F",
    "--clay": "#D98A3D", "--clay-deep": "#B36E27",
    "--gold": "#CD9A4F", "--gold-soft": "#E6BE76",
    "--bg": "#FBF3E9", "--bg-2": "#F6E7D5", "--bg-3": "#F0DBC4",
    "--hero-1": "#C8693F", "--hero-2": "#8E3F2A", "--hero-3": "#52241A",
    "--hero-tint": "46,22,15"
  },
  // 오션 — teal water & sand
  "#2E6E6A": {
    "--forest": "#2E6E6A", "--forest-deep": "#1C4A47", "--forest-2": "#3C817C",
    "--sage": "#6FA39E", "--sage-soft": "#A6C7C3",
    "--clay": "#D2A04B", "--clay-deep": "#AF7E2E",
    "--gold": "#C7A24E", "--gold-soft": "#DFC07E",
    "--bg": "#F3F4EC", "--bg-2": "#E6EBE1", "--bg-3": "#D9E1D7",
    "--hero-1": "#2F6F6B", "--hero-2": "#1E4F4C", "--hero-3": "#103432",
    "--hero-tint": "10,28,27"
  }
};

const PALETTES = [
  ["#33503F", "#C2784B", "#FAF6EF"],  // 포레스트
  ["#BC5A3C", "#D98A3D", "#FBF3E9"],  // 선셋
  ["#2E6E6A", "#D2A04B", "#F3F4EC"]   // 오션
];

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    const hero = (t.palette && t.palette[0]) || "#33503F";
    const mood = MOODS[hero] || MOODS["#33503F"];
    for (const k in mood) root.style.setProperty(k, mood[k]);
    root.setAttribute("data-headline", t.headline);
    root.setAttribute("data-shape", t.shape);
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="분위기" />
      <TweakColor
        label="컬러 무드"
        value={t.palette}
        options={PALETTES}
        onChange={(v) => setTweak("palette", v)}
      />
      <TweakSection label="타이포그래피" />
      <TweakRadio
        label="헤드라인"
        value={t.headline}
        options={[
          { value: "elegant", label: "명조" },
          { value: "modern", label: "고딕" },
          { value: "airy", label: "라이트" }
        ]}
        onChange={(v) => setTweak("headline", v)}
      />
      <TweakSection label="질감" />
      <TweakRadio
        label="모서리"
        value={t.shape}
        options={[
          { value: "editorial", label: "에디토리얼" },
          { value: "soft", label: "소프트" }
        ]}
        onChange={(v) => setTweak("shape", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
