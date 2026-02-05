import { useState, useEffect } from "react";
import { badgeApi } from "@/services/endpoints/badge";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface UserBadgeData {
  badges: Badge[];
  unlocked: number; // Assuming unlocked is a count?
}

function BadgesPage() {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadgeData>({
    badges: [],
    unlocked: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const [all, user] = await Promise.all([
        badgeApi.getAll(),
        badgeApi.getUserBadges(),
      ]);
      setAllBadges(all.badges || []);
      setUserBadges(user);
    } catch (error) {
      console.error("Error cargando medallas:", error);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (badgeId: string) => {
    return userBadges.badges.some((b) => b.id === badgeId);
  };

  if (loading) {
    return (
      <section
        className="container"
        style={{ paddingTop: "120px", textAlign: "center" }}
      >
        <p>Cargando medallas...</p>
      </section>
    );
  }

  return (
    <section className="container" style={{ paddingTop: "120px" }}>
      <div
        className="section-header"
        style={{ textAlign: "center", marginBottom: "var(--spacing-2xl)" }}
      >
        <h2>🏆 Medallas</h2>
        <p>
          Desbloquea medallas completando ejercicios y alcanzando nuevos niveles
        </p>
        <div
          style={{
            marginTop: "var(--spacing-lg)",
            display: "inline-flex",
            padding: "var(--spacing-md) var(--spacing-xl)",
            background: "rgba(0, 255, 136, 0.1)",
            border: "1px solid rgba(0, 255, 136, 0.3)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <span
            style={{
              color: "var(--neon-green)",
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
            }}
          >
            {userBadges.unlocked} / {allBadges.length} desbloqueadas
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "var(--spacing-lg)",
        }}
      >
        {allBadges.map((badge) => {
          const unlocked = isUnlocked(badge.id);
          return (
            <div
              key={badge.id}
              className="glass-card"
              style={{
                textAlign: "center",
                opacity: unlocked ? 1 : 0.5,
                filter: unlocked ? "none" : "grayscale(100%)",
              }}
            >
              <div
                style={{ fontSize: "3rem", marginBottom: "var(--spacing-md)" }}
              >
                {badge.icon}
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  marginBottom: "var(--spacing-sm)",
                  color: unlocked ? "var(--neon-cyan)" : "var(--text-muted)",
                }}
              >
                {badge.name}
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                {badge.description}
              </p>
              {unlocked && (
                <div
                  style={{
                    marginTop: "var(--spacing-md)",
                    padding: "var(--spacing-xs) var(--spacing-md)",
                    background: "rgba(0, 255, 136, 0.2)",
                    borderRadius: "var(--radius-sm)",
                    display: "inline-block",
                    fontSize: "0.8rem",
                    color: "var(--neon-green)",
                  }}
                >
                  ✓ Desbloqueada
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BadgesPage;
