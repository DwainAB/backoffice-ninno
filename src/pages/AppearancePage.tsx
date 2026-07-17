import { useEffect, useState } from "react";
import { getConfig, uploadBackground, uploadLogo, type AppConfig } from "../api/client";
import ImageUploadCard from "../components/ImageUploadCard";

export default function AppearancePage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConfig()
      .then(setConfig)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (!config) return <p>Impossible de charger la configuration.</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
      <ImageUploadCard
        title="Image de fond"
        description="Fond affiché sur les écrans de l'application."
        currentUrl={config.backgroundImageUrl}
        onUpload={async (file) => {
          const updated = await uploadBackground(file);
          setConfig(updated);
        }}
      />
      <ImageUploadCard
        title="Logo"
        description="Logo affiché en haut au centre de l'application."
        currentUrl={config.logoImageUrl}
        onUpload={async (file) => {
          const updated = await uploadLogo(file);
          setConfig(updated);
        }}
      />
    </div>
  );
}
